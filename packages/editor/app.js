import 'bootstrap/css/bootstrap.css';
import 'editor/scss/modules/all.scss';

import RootComponent from './components/root';
// import { default as RootComponent, CSSTokenizer } from 'common/components/text-editor';
import BaseApplication from 'base/app';

import convertUnit from 'common/utils/html/css/convert-unit';

window.conv = convertUnit;

import PreviewPlugin from './plugins/preview';
import HistoryPlugin from './plugins/history';
import SettingsPlugin from './plugins/settings';
import ShortcutPlugin from './plugins/shortcuts';
import ClipboardPlugin from './plugins/clipboard';
import BasicFontPlugin from './plugins/basic-fonts';
import TestProjectPlugin from './plugins/test-project';
import LoadRootEntityPlugin from './plugins/root-entity-loader';
import ClipboardPasteEntity from './plugins/clipboard-paste-entity';
import BasicDOMEntitiesPlugin from './plugins/basic-dom-entities';
import BasicPaneComponentsPlugin from './plugins/basic-pane-components';

import React from 'react';
import ReactDOM from 'react-dom';

class Application extends BaseApplication {

  static plugins = BaseApplication.plugins.concat([
    PreviewPlugin,
    HistoryPlugin,
    ShortcutPlugin,
    SettingsPlugin,
    ClipboardPlugin,
    BasicFontPlugin,
    TestProjectPlugin,
    LoadRootEntityPlugin,
    ClipboardPasteEntity,
    BasicDOMEntitiesPlugin,
    BasicPaneComponentsPlugin
  ])

  didInitialize() {
    // ReactDOM.render(React.createElement(RootComponent, { app: app, source: 'abc   def\n123', tokenizer: CSSTokenizer.create(), style: { fontSize: '18px', whiteSpace: 'nowrap', color: '#F60' } }), this.config.element);

    ReactDOM.render(React.createElement(RootComponent, { app: app }), this.config.element);
  }

  /**
   * current focus of the app
   */

  setFocus(item) {

    // turn off current focus immediately. Fixes a
    // NULL exception bug when rAF fires and the focused element
    // does *not* actually exist as a child of a root entity
    this.setProperties({
      focus: void 0
    });

    // wait for rAF.
    // TODO - add this in runloop. This feels like
    // broken abstraction.
    requestAnimationFrame(() => {
      this.setProperties({
        focus: item
      });
    });
  }
}

export default Application;
