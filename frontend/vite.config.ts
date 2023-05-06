import { defineConfig, UserConfig, splitVendorChunk } from 'vite';
import vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import { getFileBasedRouteName } from 'unplugin-vue-router';
import VueRouter from 'unplugin-vue-router/vite';
import {
  VueUseComponentsResolver,
  Vuetify3Resolver,
  VueUseDirectiveResolver
} from 'unplugin-vue-components/resolvers';
import visualizer from 'rollup-plugin-visualizer';
import virtual from '@rollup/plugin-virtual';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import virtualModules from './scripts/virtual-modules';
import { localeFilesFolder, srcRoot } from './scripts/paths';
import autoprefixer from 'autoprefixer';
import type { ManualChunkMeta } from 'rollup';

/**
 * A function to split vendor chunks based on the id of the module
 */
function splitMoreVendorChunk(
  id: string,
  getModuleInfo: ManualChunkMeta,
  extraSplitName?: (id: string) => string | undefined
): string | undefined {
  const isVendorChunk = splitVendorChunk();

  if (isVendorChunk(id, getModuleInfo)) {
    if (typeof extraSplitName === 'function') {
      const extraName = extraSplitName(id);

      if (extraName) {
        return `vendor.${extraName}`;
      }
    }

    return 'vendor';
  }
}

/**
 * A function to manually split chunks based on the id of the module
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function manualChunks(
  id: string,
  getModuleInfo: ManualChunkMeta
): string | undefined {
  if (
    id.includes('virtual:locales') ||
    id.includes('@intlify/unplugin-vue-i18n/messages')
  ) {
    return 'localization';
  }

  return splitMoreVendorChunk(id, getModuleInfo, (intId) => {
    const isMarkdown = [
      'remark',
      'rehype',
      'unified',
      'mdast',
      'hast',
      'unist',
      'micromark',
      'markdown',
      'vfile',
      'zwitch'
    ].some((name) => {
      return intId.includes(name);
    });
    const isVueRelated = ['@vue', 'vue-i18n', '@intlify', 'vue-router'].some(
      (name) => {
        return intId.includes(name);
      }
    );

    if (isMarkdown) {
      return 'markdown';
    }

    if (intId.includes('vuetify')) {
      return 'vuetify';
    }

    if (isVueRelated) {
      return 'vue';
    }

    if (intId.includes('hls.js')) {
      return 'player';
    }

    if (intId.includes('jellyfin/sdk/lib')) {
      return 'jellyfin';
    }

    if (intId.includes('lodash')) {
      return 'lodash';
    }

    if (intId.includes('date-fns')) {
      return 'date-fns';
    }
  });
}

export default defineConfig(({ mode }): UserConfig => {
  const config: UserConfig = {
    appType: 'spa',
    define: {
      __COMMIT_HASH__: JSON.stringify(process.env.COMMIT_HASH || '')
    },
    plugins: [
      virtual(virtualModules),
      /**
       * We're mixing both vite-plugin-pages and unplugin-vue-router because
       * there are issues with layouts and unplugin-vue-router is experimental:
       * https://github.com/posva/unplugin-vue-router/issues/29#issuecomment-1263134455
       *
       * At runtime we use vite-plugin-pages, while unplugin-vue-router is just
       * for types at development
       */
      Pages({
        routeStyle: 'nuxt',
        importMode: 'sync',
        moduleId: 'virtual:generated-pages'
      }),
      VueRouter({
        dts: './types/global/routes.d.ts',
        /**
         * Unplugin-vue-router generates the route names differently
         * from vite-plugin-pages.
         *
         * We overwrite the name generation function so they match and TypeScript types
         * matches.
         */
        getRouteName: (node): string => {
          const name = getFileBasedRouteName(node);

          return name === '/'
            ? 'index'
            : name
            /**
             * Remove first and trailing / character
             */
              .replace(/^./, '')
              .replace(/\/$/, '')
            /**
             * Routes with params have its types generated as
             * _itemId, while vite-plugin-pages just use hyphens for everything
             */
              .replace('/', '-')
              .replace('_', '');
        }
      }),
      vue({
        script: {
          defineModel: true
        }
      }),
      Layouts({
        importMode: () => 'sync',
        defaultLayout: 'default'
      }),
      // This plugin allows to autoimport vue components
      Components({
        dts: './types/global/components.d.ts',
        /**
         * The icons resolver finds icons components from 'unplugin-icons' using this convenction:
         * {prefix}-{collection}-{icon} e.g. <i-mdi-thumb-up />
         */
        resolvers: [
          IconsResolver(),
          VueUseComponentsResolver(),
          Vuetify3Resolver(),
          VueUseDirectiveResolver()
        ]
      }),
      /**
       * This plugin allows to use all icons from Iconify as vue components
       * See: https://github.com/antfu/unplugin-icons
       */
      Icons({
        compiler: 'vue3'
      }),
      VueI18nPlugin({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: false,
        forceStringify: true,
        include: localeFilesFolder
      })
    ],
    build: {
      /**
       * See main.ts for an explanation of this target
       */
      target: 'es2022',
      cssCodeSplit: false,
      cssMinify: 'lightningcss',
      modulePreload: false,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          plugins: [
            mode === 'analyze'
              ?
              visualizer({
                open: true,
                filename: 'dist/stats.html',
                gzipSize: true,
                brotliSize: true
              })
              : undefined
          ],
          manualChunks
        }
      }
    },
    css: {
      lightningcss: {
        nonStandard: {
          deepSelectorCombinator: true
        },
        targets: browserslistToTargets(browserslist())
      }
    },
    preview: {
      port: 3000,
      strictPort: true,
      host: '0.0.0.0',
      cors: true
    },
    server: {
      host: '0.0.0.0',
      port: 3000
    },
    resolve: {
      alias: {
        '@/': srcRoot
      }
    },
    worker: {
      format: 'es'
    }
  };

  return config;
});
