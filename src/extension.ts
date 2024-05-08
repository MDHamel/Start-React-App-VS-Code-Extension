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

	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 7);
		myStatusBarItem.command = myCommandId;
		subscriptions.push(myStatusBarItem);

		myStatusBarItem.text = `$(broadcast) Start React App`;
		myStatusBarItem.show();


	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		if(isRunning){
			terminal.sendText('\x03 \n');
			myStatusBarItem.text = `$(broadcast) Start React App`;
			myStatusBarItem.show();
			isRunning = false;
		}
		else{
			terminal.sendText(npmCommand + "\n");
			myStatusBarItem.text = `$(radio-tower) React App Running`;
			myStatusBarItem.show();
			isRunning = true;
		}
	}));
}