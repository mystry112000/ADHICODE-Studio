# ADHICODE Studio Bash Completion
_adhicode_studio_completions() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    local commands="tools run skills skill workflow terminal jarvis ai server config config-set"

    if [[ $COMP_CWORD -eq 1 ]]; then
        COMPREPLY=($(compgen -W "$commands --help --version" -- "$cur"))
    elif [[ $COMP_CWORD -ge 2 ]]; then
        case "${COMP_WORDS[1]}" in
            tools)     COMPREPLY=($(compgen -W "list run" -- "$cur")) ;;
            skills)    COMPREPLY=($(compgen -W "list" -- "$cur")) ;;
            workflow)  COMPREPLY=($(compgen -W "analyze build deploy test review scaffold audit" -- "$cur")) ;;
            skill)     COMPREPLY=($(compgen -W "code-review project-init terminal-pro termux-optimize voice-control workflow-designer" -- "$cur")) ;;
            run)       COMPREPLY=($(compgen -W "format lint review tree search sysinfo process disk weather notify shorten whois headers qr docker gitlog deploy ports" -- "$cur")) ;;
        esac
    fi
}
complete -F _adhicode_studio_completions adhicode-studio
