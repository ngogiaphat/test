import type { PieceContext, Args } from '@sapphire/framework';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
export abstract class CatCommand extends SubCommandPluginCommand<Args, CatCommand> {
	public hidden: boolean;
	public example: string;
	public constructor(context: PieceContext, options: CatCommand.Options) 
	{
		super(context, options);
		this.hidden = options.hidden ?? false;
		this.example = options.example ?? ''
	}
}
export namespace CatCommand 
{
	export type Options = SubCommandPluginCommandOptions & {
		hidden?: boolean;
		example?: string;
	};
}