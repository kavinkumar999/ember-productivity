import { ExtensionContext, commands, window, workspace, QuickPickItem, Uri, CompletionItem, CompletionItemKind, SnippetString, MarkdownString, languages } from "vscode";
import path from "path";
import { findRelatedFiles } from "./related-files";
import { COMMANDS } from "./constants";
import fs from "fs";

export interface RelatedFiles {
  label: string;
  file: string,
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
    this.description = path.relative(basePath, rootPath);
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
  registerSnippets(context);
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
async function registerSnippets(context: ExtensionContext) {
  const snippetFiles = [
      { language: 'handlebars', path: 'ember-hbs.json' },
      { language: 'javascript', path: 'emberjs.json' },
      { language: 'typescript', path: 'emberjs.json' }
  ];

  snippetFiles.forEach(file => {
      const snippetPath = path.join(context.extensionPath, 'src', 'snippets', file.path);
      
      if (fs.existsSync(snippetPath)) {
          const snippetContent = fs.readFileSync(snippetPath, 'utf8');
          const snippets = JSON.parse(snippetContent);

          Object.keys(snippets).forEach(snippetName => {
              const snippet = snippets[snippetName];
              const completionItem = new CompletionItem(snippet.prefix, CompletionItemKind.Snippet);
              completionItem.insertText = new SnippetString(snippet.body.join('\n'));
              completionItem.documentation = new MarkdownString(snippet.description);

              context.subscriptions.push(
                  languages.registerCompletionItemProvider(file.language, {
                      provideCompletionItems() {
                          return [completionItem];
                      }
                  })
              );
          });
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
