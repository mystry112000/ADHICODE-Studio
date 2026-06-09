Register-ArgumentCompleter -Native -CommandName "adhicode-studio" -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)
    $commands = @(
        "tools", "run", "skills", "skill", "workflow",
        "terminal", "jarvis", "ai", "server", "config",
        "config-set", "--help", "--version"
    )
    $commands | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
        [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
    }
}
