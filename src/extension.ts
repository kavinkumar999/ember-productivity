import * as vscode from "vscode";
import path from "path";
import { getRelatedFiles } from "./related-files";
import { COMMANDS } from "./constants";

/**
 * @param context The extension context
 */
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      COMMANDS.SWITCH_RELATED_FILES,
      switchRelatedFiles
    )
  );
}

/**
 * Handles the logic for switching related files.
 */
async function switchRelatedFiles() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No file is currently open.");
    return;
  }

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceFolder) {
    vscode.window.showErrorMessage("Workspace folder not found.");
    return;
  }

  const currentFilePath = editor.document.uri.fsPath;
  const currentFileDir = path.dirname(currentFilePath);
  const currentFileName = path.basename(currentFilePath);

  const relatedFiles = getRelatedFiles(currentFileDir, currentFileName);

  if (relatedFiles.length === 0) {
    vscode.window.showInformationMessage("No related files found.");
    return;
  }

  if (relatedFiles.length === 1) {
    openFile(relatedFiles[0].path);
    return;
  }

  const selectedFileLabel = await vscode.window.showQuickPick(
    relatedFiles.map((file) => file.label),
    { placeHolder: "Select a file to switch to" }
  );

  if (selectedFileLabel) {
    const selectedFile = relatedFiles.find(
      (file) => file.label === selectedFileLabel
    );
    if (selectedFile) {
      openFile(selectedFile.path);
    }
  }
}

/**
 * Opens a file in the editor.
 * @param filePath The path to the file
 */
async function openFile(filePath: string) {
  const document = await vscode.workspace.openTextDocument(filePath);
  vscode.window.showTextDocument(document);
}

/**
 * This method is called when your extension is deactivated
 */
export function deactivate() {}
