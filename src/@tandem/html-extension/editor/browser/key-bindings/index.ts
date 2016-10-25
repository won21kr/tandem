import { inject } from "@tandem/common/decorators";
import { Action } from "@tandem/common/actions";
import { IWorkspace } from "@tandem/editor/browser/models/base";
import { InsertTool } from "@tandem/editor/browser/models/insert-tool";
import { BaseCommand } from "@tandem/common/commands";
import { SetToolAction } from "@tandem/editor/browser/actions";
import { textToolDependency } from "../models";
import { TEXT_TOOL_KEY_CODE } from "@tandem/html-extension/constants";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { pointerToolDependency } from "@tandem/editor/browser/models/pointer-tool";
import { parseMarkup, evaluateMarkup, SyntheticDOMElement } from "@tandem/synthetic-browser";
import { ClassFactoryDependency, DependenciesDependency, Dependencies } from "@tandem/common/dependencies";
import { WorkspaceToolFactoryDependency, GlobalKeyBindingDependency } from "@tandem/editor/browser/dependencies";

abstract class BaseInsertElementTool extends InsertTool {

  @inject(DependenciesDependency.ID)
  private _dependencies: Dependencies;

  constructor(readonly options: any, editor: IWorkspace) {
    super(editor);
    this.entityIsRoot = options.root;
  }

  get displayEntityToolFactory() {
    return this._dependencies.query<WorkspaceToolFactoryDependency>(pointerToolDependency.id);
  }

  createSyntheticDOMElement() {

    // width & height need to be 0'd since some elements have a size by default such as iframes
    return evaluateMarkup(parseMarkup(`<${this.options.nodeName} ${this.options.attributes ? this.options.attributes + " " : ""}style="${this.options.style}position:absolute;width:0px;height:0px;" />`).childNodes[0], this.editor.document) as SyntheticDOMElement;
  }
}

function createElementInsertToolClass(options) {
  return class InsertElementTool extends BaseInsertElementTool {
    constructor(editor: IWorkspace) {
      super(options, editor);
    }
  };
}

export const keyBindingDependency = [
  new GlobalKeyBindingDependency(TEXT_TOOL_KEY_CODE, class SetPointerToolCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new SetToolAction(this.dependencies.query<WorkspaceToolFactoryDependency>(textToolDependency.id)));
    }
  })
];

const insertElementKeyBindings = {
  "d" : { nodeName:  "div", attributes: ``, style: "background:rgba(0,0,0,0.1);" },
  "a" : { nodeName: "template", attributes: `title="Untitled"`, style: "background: white; position:absolute; ", root: true }
};

for (const key in insertElementKeyBindings) {
  addElementKeyBinding(key, insertElementKeyBindings[key]);
}

function addElementKeyBinding(key: string, options: { nodeName: string, attributes: string }) {
  keyBindingDependency.push(new GlobalKeyBindingDependency(key, class SetPointerToolCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new SetToolAction(<ClassFactoryDependency>this.dependencies.link(new ClassFactoryDependency(null, createElementInsertToolClass(options)))));
    }
  }));
}