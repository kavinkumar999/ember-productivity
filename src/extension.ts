import { ExtensionContext, commands, window, workspace, QuickPickItem, Uri } from "vscode";
import path from "path";
import { findRelatedFiles } from "./related-files";
import { COMMANDS } from "./constants";


export interface RelatedFiles {
	label: string;
	path: string;
}

export class TypeItem implements QuickPickItem {
  label: string;
  rootPath: string;
  description: string | undefined;
  detail?: string | undefined;

  constructor(
    item: RelatedFiles,
    rootPath: string,
    basePath: string,
    detail?: string | undefined
  ) {
    this.label = item.label;
    this.rootPath = rootPath;
    this.description = path.relative(basePath, path.join(rootPath, item.label));
    this.detail = detail;
  }

  public getPath(): string {
		return path.join(this.rootPath, this.label);
  }

  public uri(): Uri {
    return Uri.file(this.getPath());
  }
}


/**
 * @param context The extension context
 */
export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(
      COMMANDS.SWITCH_RELATED_FILES,
      switchRelatedFiles
    )
  );
}

/**
 * Handles the logic for switching related files.
 */
async function switchRelatedFiles() {
  const editor = window.activeTextEditor;
  if (!editor) {
    window.showErrorMessage("No file is currently open.");
    return;
  }

  const basePath = workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!basePath) {
    window.showErrorMessage("Workspace folder not found.");
    return;
  }

  const currentFilePath = editor.document.uri.fsPath;
  const currentFileDir = path.dirname(currentFilePath);
  const currentFileName = path.basename(currentFilePath);

	const files = findRelatedFiles(currentFileDir, currentFileName, basePath);

  if (files.length === 0) {
    window.showInformationMessage("No related files found.");
    return;
  }

  if (files.length === 1) {
    open(files[0]);
    return;
  }

	window.showQuickPick(files as TypeItem[], {
      placeHolder: "Select File",
      matchOnDescription: true,
    })
    .then((item) => {
      if (item) {
        open(item);
      }
    });
}

function open(item: TypeItem) {
  workspace.openTextDocument(item.uri())
    .then((doc) =>
      window.showTextDocument(doc.uri, {
        preview: true
      })
    );
}
/**
 * This method is called when your extension is deactivated
 */
export function deactivate() {}
