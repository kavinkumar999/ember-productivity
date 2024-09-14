import { ExtensionContext, commands, window, workspace, QuickPickItem, Uri, CompletionItem, CompletionItemKind, SnippetString, MarkdownString, languages } from 'vscode';
import path from 'path';
import { findRelatedFiles } from './related-files';
import { COMMANDS } from './constants';

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
    detail?: string | undefined
  ) {
    this.label = item.label;
    this.rootPath = path.join(rootPath, item.path);
    this.description = item.path;
    this.detail = detail;
  }

  public getPath(): string {
		return this.rootPath;
  }

  public uri(): Uri {
    return Uri.file(this.getPath());
  }
}

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(
      COMMANDS.SWITCH_RELATED_FILES,
      switchRelatedFiles
    )
  );
}

async function switchRelatedFiles() {
  const editor = window.activeTextEditor;
  if (!editor) {
    window.showErrorMessage('No file is currently open.');
    return;
  }

  const basePath = workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!basePath) {
    window.showErrorMessage('Workspace folder not found.');
    return;
  }

  let rootPath = workspace.rootPath || '';
  let relativeFileName = workspace.asRelativePath(window?.activeTextEditor?.document?.fileName || '');

	const files: Array<TypeItem> = findRelatedFiles(rootPath, relativeFileName);

  if (files.length === 0) {
    window.showInformationMessage('No related files found.');
    return;
  }

  if (files.length === 1) {
    let [ file = {} as TypeItem ] = files;
    open(file);
    return;
  }

	window.showQuickPick(files as TypeItem[], {
      placeHolder: 'Select File',
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

export function deactivate() {}
