import DOMPurify from 'dompurify';
import { unified } from 'unified';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import stripMarkdown from 'strip-markdown';

// Reference: https://www.w3schools.com/tags/
const disallowedHTMLTags = new Set([
  'a',
  'audio',
  'base',
  'body',
  'button',
  'canvas',
  'datalist',
  'dialog',
  'details', // Maybe support this?
  'figure',
  'figcaption',
  'footer',
  'form',
  'head',
  'header',
  'html',
  'iframe',
  'img',
  'input',
  'link',
  'map',
  'meta',
  'nav',
  'object',
  'picture',
  'script',
  'select',
  'source',
  'style',
  'svg',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'title',
  'tr',
  'track',
  'video'
]);

interface ChildText {
  type: 'text';
  value: string;
}

interface HTMLNode {
  type: 'html';
  value: string;
}

interface Children {
  children?: ChildText[];
}

interface LinkableType extends Children {
  title?: string;
  alt?: string;
  url: string;
}

interface ReferenceType extends Children {
  identifier: string;
  label?: string;
  alt?: string;
}

interface DefinitionType extends LinkableType {
  identifier: string;
  label?: string;
}

interface TextNode {
  type: 'text';
  value: string;
}

/**
 * Get children text value and join them together.
 * Used for some link/image nodes.
 *
 * @param children - Children to be joined.
 */
function getChildText(children: ChildText[]): string {
  return children
    .filter((e) => e.type === 'text')
    .map((e) => e.value)
    .join(', ');
}

/**
 * Convert link/image node to text.
 * @param node - Node to be converted.
 * @param isImage - Whether the node is an image.
 */
function linkHandler(node: LinkableType, isImage = false): TextNode {
  let alt = node.alt ?? '';

  if (!isImage && node.children) {
    alt = getChildText(node.children);
  }

  let value = `![${alt}](${node.url})`;

  if (node.title) {
    value = value.replace('](', ` "${node.title}"](`);
  }

  return {
    type: 'text',
    value: isImage ? value : value.slice(1)
  };
}

/**
 * Convert link/image reference node to text.
 * @param node - Node to be converted.
 * @param isImage - Whether the node is an image.
 */
function referenceHandler(node: ReferenceType, isImage = false): TextNode {
  let text = node.alt ?? '';

  if (node.children) {
    text = node.children
      .filter((e) => e.type === 'text')
      .map((e) => e.value)
      .join(', ');
  }

  const label = node.label ?? node.identifier;

  const value = `![${text}][${label}]`;

  return {
    type: 'text',
    value: isImage ? value : value.slice(1)
  };
}

/**
 * Convert definition node to text.
 * @param node - Node to be converted.
 */
function definitionHandler(node: DefinitionType): TextNode {
  const label = node.label ?? node.identifier;
  const value = `[${label}]: ${node.url}\n`;

  return {
    type: 'text',
    value
  };
}

const imageHandler = (node: LinkableType): TextNode => linkHandler(node, true);
const imageReferenceHandler = (node: ReferenceType): TextNode =>
  referenceHandler(node, true);

/**
 * Filter HTML tag, remove/escape disallowed HTML tags.
 *
 * A naive function will extract the tag name from the HTML node value,
 * and check if it's in the disallowed array. If it's we will turn it into a text node.
 *
 * @param node - Node to be filtered.
 * @returns Filtered node.
 */
function filterHTMLTag(node: HTMLNode): HTMLNode | TextNode {
  const tagName = node.value.match(/<(\w+)/i)?.[1];
  const isClosingTag = node.value.match(/<\/(\w+)/i)?.[1];

  if (tagName && disallowedHTMLTags.has(tagName.toLowerCase())) {
    return {
      type: 'text',
      value: node.value
    };
  }

  if (isClosingTag && disallowedHTMLTags.has(isClosingTag.toLowerCase())) {
    return {
      type: 'text',
      value: node.value
    };
  }

  return node;
}

/**
 * Convert markdown to HTML to be used in the components via <v-html>.
 *
 * Internally use unified, remark plugins, and rehype plugins.
 * The content will be sanitized by rehype-sanitize but it's not guaranteed to be safe.
 *
 * We also not going to fully support HTML tags and markdown syntax in the content.
 *
 * It also support HTML tags in the markdown content.
 *
 * @param markdownContent - Content to be converted.
 * @param skipMarkdown - Whether to skip markdown conversion.
 * 
 * @returns Converted + Sanitized HTML string.
 */
export async function renderMarkdown(markdownContent: string, skipMarkdown: boolean = false): Promise<string> {
  if (skipMarkdown) {
    return DOMPurify.sanitize(markdownContent, {USE_PROFILES: {html: true}});
  }

  const result = await unified()
    .use(stripMarkdown, {
      keep: [
        'blockquote',
        'list',
        'listItem',
        'strong',
        'emphasis',
        'delete',
        'thematicBreak',
        'heading',
        'inlineCode',
        'code',
        'thematicBreak'
      ],
      remove: [
        ['image', imageHandler],
        ['link', linkHandler],
        ['imageReference', imageReferenceHandler],
        ['linkReference', referenceHandler],
        ['definition', definitionHandler],
        ['html', filterHTMLTag]
      ]
    })
    .use(remarkParse)
    .use(remarkBreaks)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdownContent);

  return DOMPurify.sanitize(String(result), {USE_PROFILES: {html: true}});
}
