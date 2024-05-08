import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem;
const terminal:vscode.Terminal = vscode.window.createTerminal({ name: 'npm' });

export async function activate({ subscriptions }: vscode.ExtensionContext) {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) return false;

	// Use vscode.workspace.fs to read the package.json file
	try{
		const packageJsonPath = workspaceFolder.uri.fsPath + '/package.json';
		const packageJson = (await vscode.workspace.fs.readFile(vscode.Uri.file(packageJsonPath)));
		const packageJsonContent = JSON.parse(packageJson.toString());
	
		if (packageJsonContent.dependencies.react){
			runExtension(subscriptions);
		}
	}
	catch(error:any){
		return false;
	}
	
}

function runExtension(subscriptions: any){
	const myCommandId = 'mdhamel.startReactServer';
	const npmCommand = 'npm run start';

	let isRunning:boolean = false;

	const startText = `$(vm)\xa0\xa0Start React App`;
	const runningText = `$(vm-running)\xa0\xa0React App Running`;


	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 7);
		myStatusBarItem.command = myCommandId;
		subscriptions.push(myStatusBarItem);

		myStatusBarItem.text = startText;
		myStatusBarItem.show();


	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		if(isRunning){
			terminal.sendText('\x03 \n');
			myStatusBarItem.text = startText;
			myStatusBarItem.show();
			isRunning = false;
		}
		else{
			terminal.sendText(npmCommand + "\n");
			myStatusBarItem.text = runningText;
			myStatusBarItem.show();
			isRunning = true;
		}
	}));
}