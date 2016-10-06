import { inject } from "@tandem/common/decorators";
import { Action } from "@tandem/common/actions";
import { IEditor } from "@tandem/editor/models/base";
import { InsertTool } from "@tandem/editor/models/insert-tool";
import { SetToolAction } from "@tandem/editor/actions";
import { TEXT_TOOL_KEY_CODE } from "@tandem/html-extension/constants";
import { FrontEndApplication } from "@tandem/editor/application";
import { textToolDependency } from "@tandem/html-extension/models/text-tool";
import { pointerToolDependency } from "@tandem/editor/models/pointer-tool";
import { parseMarkup, MarkupElementExpression } from "@tandem/html-extension/lang";
import { BaseCommand, BaseApplicationCommand } from "@tandem/common/commands";
import { ClassFactoryDependency, DEPENDENCIES_NS, Dependencies } from "@tandem/common/dependencies";
import { EditorToolFactoryDependency, GlobalKeyBindingDependency } from "@tandem/editor/dependencies";

abstract class BaseInsertElementTool extends InsertTool {

  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;

  constructor(readonly options: any, editor: IEditor) {
    super(editor);
    this.entityIsRoot = options.root;
  }

  get displayEntityToolFactory() {
    return this._dependencies.query<EditorToolFactoryDependency>(pointerToolDependency.ns);
  }

  createSource() {

    // width & height need to be 0'd since some elements have a size by default such as iframes
    return parseMarkup(`<${this.options.nodeName} ${this.options.attributes ? this.options.attributes + " " : ""}style="${this.options.style}position:absolute;width:0px;height:0px;" />`).children[0];
  }
}

function createElementInsertToolClass(options) {
  return class InsertElementTool extends BaseInsertElementTool {
    constructor(editor: IEditor) {
      super(options, editor);
    }
  };
}

export const keyBindingDependency = [
  new GlobalKeyBindingDependency(TEXT_TOOL_KEY_CODE, class SetPointerToolCommand extends BaseCommand {
    execute(action: Action) {
      this.bus.execute(new SetToolAction(this.dependencies.query<EditorToolFactoryDependency>(textToolDependency.ns)));
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