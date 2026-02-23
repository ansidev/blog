---
type: post
title: How to set environment variable?
date: 2023-01-25T15:50:51+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-set-environment-variable
categories:
  - Tips and Tricks
tags:
  - operating system
  - shell
  - scripting
---

## Solutions

| Action                                      | macOS/Linux shell                                                                                                                                                                                                                                       | Powershell                                                                                                                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| List all environment variables              | `env` or `printenv` or `set`                                                                                                                                                                                                                            | `dir env:`                                                                                                                                                               |
| Reference a variable                        | `$name` or `${name}`                                                                                                                                                                                                                                    | `$env:name`                                                                                                                                                              |
| Print the value of the environment variable | `echo $name`                                                                                                                                                                                                                                            | `echo $env:name`                                                                                                                                                         |
| Set local environment variable              | Current process only: `name=value` or `set name=value`<br>Current process and its child processes: `export name=value`                                                                                                                                  | `$env:name = 'value'`                                                                                                                                                    |
| Set global environment variable             | Place an export command in your shell's startup script of your home directory:<br><ul><li>`~/.bashrc`</li><li>`~/.bash_profile`</li><li>`~/.zshrc`</li><li>`~/.zsh_profile`</li><li>`~/.profile`</li></ul>or `/etc/profile` for system-wide operations. | User Variable: `[Environment]::SetEnvironmentVariable("name", "value" ,"User")`<br>Machine Variable: `[Environment]::SetEnvironmentVariable("name", "value" ,"Machine")` |
| Unset                                       | `name=` or `unset name`                                                                                                                                                                                                                                 | User Variable: `[Environment]::SetEnvironmentVariable("name", $null ,"User")`<br>Machine Variable: `[Environment]::SetEnvironmentVariable("name", $null ,"Machine")`     |

Where:

- `name`: The name of the environment variable you want to set.
- `value`: The value you want to assign to the new environment variable.

### Linux/macOS

- Environment variables in macOS/Unixes are **case-sensitive**.
- Global environment variables (available to ALL processes) are named in **uppercase**, with **words joined with underscore** (_), e.g., JAVA_HOME.
- Local variables (available to the current process only) are in **lowercase**.

### Windows

- Environment variables are **NOT case-sensitive** (because the legacy DOS is NOT case-sensitive).
- Environment variables are typically named in uppercase, with **words joined with underscore** (_), e.g., JAVA_HOME.

## Reference links

- [Environment Variables in Windows/macOS/Linux](https://www3.ntu.edu.sg/home/ehchua/programming/howto/Environment_Variables.html)
