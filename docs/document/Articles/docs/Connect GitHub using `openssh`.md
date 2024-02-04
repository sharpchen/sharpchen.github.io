# Connect GitHub using `openssh`

## Add new ssh key

```bash
ssh-keygen -t ed25519 -C "youremail@example.com"
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

:::tip
`passphrase` can be ignored.
:::

## Add ssh key to ssh-agent

```bash
eval "$(ssh-agent -s)"
```

```console
$ eval "$(ssh-agent -s)"
Agent pid 55041
```

:::tip
For some shell, it may not be able to execute this command correctly(`fish` for example), for that case, use `bash` instead.
:::

```bash
ssh-add ~/.ssh/id_ed25519 # replace id_25519 with actual name
```

## Check existing ssh keys

```bash
ls -al ~/.ssh
```

## Add ssh key to your GitHub account

:::tip
See: [Adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account?platform=linux)
:::

## Test your ssh connection

```bash
ssh -T git@github.com
```

```console
$ ssh -T git@github.com
Hi github_username! You've successfully authenticated, but GitHub does not provide shell access.
```

Congratulations! Your ssh connection has successfully set up.

If you see somthing like this which means you did something wrong.

```plain
...
Agent admitted failure to sign using the key.
debug1: No more authentication methods to try.
Permission denied (publickey).
```
