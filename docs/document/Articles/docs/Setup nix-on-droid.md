# Setup nix-on-droid

## Prerequisites

- Root privilege on you android phone(it's not stable in devices without root)
- nix-on-droid installed.
- Optional: `adb`, `pwsh`
    You can use `adb` to type inputs from your computer connected with your android device. 
    The following powershell function solves the escape problem of `adb shell input text`, so you don't have to escape manually.
    ```ps1
    # Use -Enter to press enter after command input
    function adbin([string]$Str, [switch]$Enter) {
        $special = @( ' ', '\|', '\$', '&', '\(', '\)', '~','\*', "\'",'"','<','>')
        foreach ($char in $special) {
            $Str = $Str -replace $char, ($char.Length -gt 1 ? $char : "\$char")
        }
        adb shell input text $Str
        if ($Enter) {
            adb shell input keyevent KEYCODE_ENTER
        }
    }
    ```
    > [!NOTE]
    > You can wrap the same as bash function by `awk` or other text manipulation tools.


## Init

- nix-on-droid may ask for url for certain file, if the url is not accessible on your phone, download it and transfer to your phone. And replace the default url as `file:///sdcard/...`
- type `yes` when nix prompt for downloads for first init.
- add and update channels: 
    ```sh
    nix-channel --add https://github.com/nix-community/home-manager/archive/release-24.05.tar.gz home-manager && channel
    ```
    > [!TIP]
    > If you use the wrapper function mentioned above, would be like this:
    >```ps1
    >adbin -Enter 'nix-channel --add https://github.com/nix-community/home-manager/archive/release-24.05.tar.gz home-manager'
    >```

## Connect to nix-on-droid

- Install `openssh`

```sh
nix profile install nixpkgs#openssh
```

- create a empty `ssh_config`, `sshd` requires at least one specified. We don't specify any option in it in this guide but it's needed afterward.

```sh
mkdir -p /etc/ssh/ && touch /etc/ssh/sshd_config
```

- generate a host key for nix-on-droid, change the key type and passphrase as you like, they don't make too much difference.

```sh
ssh-keygen -t rsa -b 4096 -f ssh_host_rsa_key -N "" # key is generated in pwd
```

- create `~/.ssh/authorized_keys` and paste your public key from your computer(`gc ~/.ssh/<name>.pub`) to this file.

```sh
mkdir -p ~/.ssh/ && touch ~/.ssh/authorized_keys && echo <pub> >> ~/.ssh/authorized_keys
```

- start ssh daemon by `sshd`

```sh
sshd -p <port> -h <host_key> -d
```

`-d` is essential to know whether your port is been taken or not. See details in `man sshd`.

- now connect to nix-on-droid from your computer

```ps1
ssh -l nix-on-droid -p <port> <ipaddr_of_phone>
```

> [!NOTE]
> `<ipaddr_of_phone>` can be inspected from your `Settings - About phone`

## Final Step

Finally you can type everything in your computer through SSH! So use nix as you like.
