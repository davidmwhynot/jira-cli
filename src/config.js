// Native
import path from 'path';
import fs from 'fs-promise';

// Packages
import inquirer from 'inquirer';

export default class Config {

	/**
	* Init config file
	*/
	async init( fileName ) {
		this.filePath = path.join(process.env.HOME, fileName);
		const filePath = this.filePath;

		// If file doesn't exist then create it
		if ( !fs.existsSync( filePath ) ) {
			this.config = await this.createConfigFile( filePath );

			// Exit when the file is created
			process.exit();
		} else {
			this.config = await this.loadConfigFile( filePath );
		}

		return this.config;
	}

	/**
	* Load config file
	*/

	async loadConfigFile( filePath ) {

	  return fs.readFile(filePath, {encoding:'utf8'}).then(function( config ){
	  	return JSON.parse( config );
	  });
	}

	/**
	* Create config file
	*/
	async createConfigFile( filePath ) {

		var questions = [
		  {
		    type: ' input',
		    name: 'host',
		    message: 'Provide your jira host: ',
		    default: 'example.atlassian.net'
		  },
		  {
		  	type: 'input',
		  	name: 'username',
		  	message: 'Please provide your jira username :'
		  },
		  {
		  	type: 'password',
		  	name: 'password',
		  	message: 'Type your jira password:'
		  },
		  {
		    type: 'confirm',
		    name: 'protocol',
		    message: 'Enable HTTPS Protocol?'
		  }
		];

		return inquirer.prompt(questions).then(function (answers) {

			const protocol = answers.protocol ? 'https' : 'http';

			const config = {
				protocol: protocol,
				host: answers.host,
				username: answers.username,
				password: answers.password,
				apiVersion: '2',
				strictSSL: true
			};

			return fs.writeFile(filePath, JSON.stringify(config), 'utf8')
				.then(function(){
					console.log('');
	   			console.log('Config file succesfully created in: ' + filePath);
	   			return config;
				});
		});
	}
}