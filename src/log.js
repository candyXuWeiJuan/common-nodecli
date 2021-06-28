const chalk=require("chalk")
module.exports={
	error(text){
        console.log(chalk.red(text))
	},
	warn(text){
        console.log(chalk.yellow(text))
	},
	success(text){
        console.log(chalk.greenBright(text))
	},
	message(text){
        console.log(chalk.cyan(text))
	},
}	
