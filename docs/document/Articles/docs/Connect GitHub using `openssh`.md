# Connect GitHub using `openssh`

## Add new ssh key

`ssh-keygen` will always generate a key pair under `~/.ssh/`, private and public key(with extension `.pub`).

- `-t` specifies the type of the key, in other words, the algorithm.
- `-C` is conventionally a email address, but you can set it arbitrary thing.
- `-f` specifies the name of the key

```bash
ssh-keygen -t ed25519 -C "youremail@example.com" -f id_ed25519_keyname
```

```console
$ ssh-keygen -t ed25519 -C "youremail@example.com"
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/username/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/username/.ssh/id_ed25519
Your public key has been saved in /home/username/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:myLr0FO3JEIwZGAP74SZ1f82WHxuzsCakb5xdaHVYpQ youremailp@example.com
The key's randomart image is:
+--[ED25519 256]--+
|.==..        ..  |
|..Oo .      .E.  |
| + +. . .    = . |
|  o.   . o .+ o  |
|   .. o S oo .   |
|   . o B X.o.    |
|  . + o.O.*      |
|   . + =o  o     |
|   .o  ..        |
+----[SHA256]-----+
```

> [!TIP]
> `passphrase` can be ignored, press enter to continue.

## Add ssh key to ssh-agent(Optional)

First we make sure ssh-agent is running:

```bash
# this applies to bash at least
eval "$(ssh-agent -s)"
```

Then add the generated keys using `ssh-add`.
This step informs ssh agent to remember passphrase so you have to input passphrase each time you use the key.
**If you didn't specify passphrase on key-generation, you can totally skip this step.**

```bash
ssh-add ~/.ssh/id_ed25519 # replace id_25519 with actual name
```

## Add ssh key to your GitHub account

> [!TIP]
> See: [Adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account?platform=linux)

## Test your ssh connection

```bash
ssh -T git@github.com
```

```console
$ ssh -T git@github.com
Hi github_username! You've successfully authenticated, but GitHub does not provide shell access.
```

Congratulations! Your ssh connection has successfully set up.

If you see something like this, you did something wrong:

```plain
...
Agent admitted failure to sign using the key.
debug1: No more authentication methods to try.
Permission denied (publickey).
```

## Multi-Account management

> [!TIP]
> See: https://docs.github.com/en/account-and-profile/how-tos/account-management/managing-multiple-accounts?platform=linux#contributing-to-multiple-accounts-using-ssh-and-multiple-keys

If you want to work with multiple accounts using ssh, you'd need to specify dedicated host for the key of your account.
The key generation step is the same, after adding the key, we add the following to `~/.ssh/config`.

```sshconfig
# NOTE use github.com as default host
# because default ssh clone url uses this.
Host github.com
    User git
    HostName ssh.github.com
    Port 443
    IdentityFile ~/.ssh/id_ed25519_github_main
    IdentitiesOnly yes # do not fallback to other keys

# NOTE: to test connection, run `ssh -T git@github-my_company`
Host github-my_company
    User git
    HostName ssh.github.com
    Port 443 # standard HTTPS port
    IdentityFile ~/.ssh/id_ed25519_github_my_company
    IdentitiesOnly yes
```

We set a host `github.com` which is the default host in the clone url so that you don't have to change host when working with your main account.
Another host `github-my_company` has to be referenced as `git@github-my_company` when communicating through ssh, meaning that every github url such as remote url must satisfy this name when working with the account intentionally.
To have a auto-switch between different host, it would be better to have dedicated folders for each host, and use git config to automatically replace the url pattern.

TODO: add example of conditional import of different user name/email using separated `.gitconfig` file.

### Working with secret account

You may want to keep your private account information as secrets, the gitconfig approach isn't sufficient.

If you don't like to expose your private username in your public dotfiles:

1. Manually replace the url with corresponding ssh address on clone or adding remote.
2. Use a shell function to set [git environment variables](https://git-scm.com/book/en/v2/Git-Internals-Environment-Variables) such as `GIT_AUTHOR_NAME`, to override with proper user info that would be required during commit.

```ps1
function enter-git-profile {
    param(
        [Parameter(Mandatory)]
        [string]$UserName,
        [string]$Email = '<>' # empty email
    )

    Write-Host ($PSStyle.Bold + "$($MyInvocation.MyCommand.Name): You should make sure your repo has proper remote url corresponds to the ssh host.") -ForegroundColor DarkBlue

    # see: https://git-scm.com/book/en/v2/Git-Internals-Environment-Variables
    $env:GIT_AUTHOR_NAME = $UserName
    $env:GIT_AUTHOR_EMAIL = $Email

    $global:_GIT_PROFILE_ENTERED = $true
}

function exit-git-profile {
    if ($global:_GIT_PROFILE_ENTERED) {
        $env:GIT_AUTHOR_NAME = $null
        $env:GIT_AUTHOR_EMAIL = $null
        $global:_GIT_PROFILE_ENTERED = $null
        Write-Host ($PSStyle.Bold + "$($MyInvocation.MyCommand.Name): profile for user 'foo' exited.") -ForegroundColor DarkBlue
    } else {
        Write-Error 'not within a git profile.'
    }
}
```
