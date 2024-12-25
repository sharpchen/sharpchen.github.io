# OpenSSH Quick Start

## The Authentication

A host machine that running a SSH server can be called as **Remote** which should store *public keys* for client hosts.
A host machine(client) attempting to connect with Remote should know a *private key* and *passphrase*.
This is how the authentication happen:

1. Client sends request to Remote.
2. If the Client had never connect to the Remote, warning prompts to confirm connection implying it may be dangerous.
3. If any public key on Remote matches the client, Remote requests the client for authenticator which should be calculated by *passphrase* and *private key*
4. User enter the *passphrase* to decrypt the private key, SSH auto-calculates the authenticator, then send it to the Remote.

## Client Side

- Generate public key for connecting **one or more** remotes by `ssh-keygen`
```sh
ssh-keygen -t rsa
```
- Register new public key to remote by `ssh-copy-id`(may require login on remote)
```sh
# add public key under `~/.ssh/` to `~/.ssh/authorized_keys` on <remote>
ssh-copy-id -i <pub_key_file> [<username>@]<remote>
```
- Managing authenticated state and **agent forwarding** by `ssh-agent`
```sh
ssh-agent $SHELL
```
- Add private key to `ssh-agent` to memorize the state of the key by `ssh-add`
```sh
ssh-add ~/.ssh/id_ed25519
ssh-add -l # list all private keys memorized by ssh-agent
ssh-add -d id_ed25519 # inform ssh-agent to forget this key
ssh-add -D # forget all keys
```
- Managing once connected remote in `~/.ssh/known_hosts`
- File transfer by `scp`
- Modify *passphrase* by `ssh-keygen` if you forgot
```sh
ssh-keygen -p 
```

## Server Side

- Start SSH server by `sshd`
- Manage SSH server config by `/etc/ssh/sshd_config`
- Manage public key for multiple clients in `~/.ssh/authorized_keys`
> [!NOTE]
> Besides `ssh-copy-id`, you can directly edit `~/.ssh/authorized_keys` to add new public key for a client.


## Create Key Pair

```sh
ssh-keygen [-t <type>] [-f <path>] [-N <passphrase>] [-C <comment>]
```

- `-t`: specify key type, `ed25519` by default.
- `-f`: output fullname of the key, public key will have extra extension `.pub`. `ssh-keygen` will prompt for it if not specified anyway.
- `-N`: specify passphrase, will ask anyway if unspecified. This may expose your passphrase to command history.
- `-C`: comment for identifying the key.

> [!NOTE]
> see `man ssh-keygen`

## Re-encrypt Key

You might want to encrypt the keys with different type and passphrase, as well as a new name.

```sh
ssh-keygen -p [-t <type>] [-f <path>] [-P <old_passphrase>] [-N <new_passphrase>]
```

Similar to creating a key pair, you don't have to fill all options, leave them empty and let the cli prompt for you.
