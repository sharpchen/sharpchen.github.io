# Setup nix-on-droid

## Prerequisites

- Root privilege on you android phone(it's not stable in devices without root)
- nix-on-droid installed.
- Optional: `adb`, `pwsh`
    You can use `adb` to type inputs from your computer connected with your android device.
    The following powershell function solves the escape problem of `adb shell input text`, so you don't have to escape manually.
    ```ps1
    # Use -Enter to press enter after command input
    <#
        This script helps to input text for terminal like Termux on Android
        It may not function on input scenarios other than shell on Android
        It DOES NOT start shell on Android but simulate key press to input text.
        NOTE: if default port fails, try another port
    #>
    function Send-AdbShellInput {
        param(
            [Parameter(Mandatory)]
            [string]$InputText,
            [ushort]$Port = 5037,
            [string]$SerialNumber,
            [switch]$AcceptLine
        )

        begin {
            & ./Assert-AdbServer.ps1 @PSBoundParameters

            if (-not $SerialNumber) {
                $flags = @('-P', $Port)
            } else {
                $flags = @('-P', $Port, '-s', $SerialNumber)
            }

            $specials = @'
        |$%;\&~*'"`<>()
        '@

        }

        end {
            $InputText = $InputText -replace "[$([regex]::Escape($specials))]", '\$0'
            $InputText = $InputText -replace ' ', '%s'

            adb @flags shell input text $InputText

            if ($AcceptLine) {
                adb @flags shell input keyevent KEYCODE_ENTER
            }
        }
    }

    ```
    > [!NOTE]
    > You can wrap the same as bash function by `awk` or other text manipulation tools.

## Init

1. `nix-on-droid` may ask for url for certain file, if the url is not accessible on your phone, download it and transfer to your phone. And replace the default url as `file:///sdcard/...`
> remember to allow file permision for nix-on-droid.
2. Type `yes` when nix prompt for downloads for first init.
3. Add and update channels:
    ```sh
    nix-channel --add https://nixos.org/channels/nixos-unstable nixpkgs && nix-channel --add https://github.com/nix-community/home-manager/archive/master.tar.gz home-manager && nix-channel --update
    ```
    > [!TIP]
    > If you use the wrapper function mentioned above, would much easier to input:
    >```ps1
    >Send-AdbShellInput -InputText 'nix-channel --add https://github.com/nix-community/home-manager/archive/release-24.05.tar.gz home-manager' -AcceptLine
    >```
4. Update `nix` cli: default nix is out-dated, might not work with your current config like home-manager.
    ```sh
    nix profile install nixpkgs#nix --priority 4
    ```

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

> [!TIP]
> Use this instead if you prefer pwsh wrapper function above, replace the pubkey name if necessary.
>```ps1
>Send-AdbShellInput -InputText ('mkdir -p ~/.ssh/ && touch ~/.ssh/authorized_keys && echo ''{0}'' >> ~/.ssh/authorized_keys' -f (gc ~/.ssh/id_ed25519.pub)) -AcceptLine
>```

- start ssh daemon by `sshd`

```sh
$(which sshd) -p 8080 -h ./ssh_host_rsa_key -d
```

`-d` is essential to know whether your port is been taken or not. See details in `man sshd`.

- now connect to nix-on-droid from your computer

```sh
ssh -l nix-on-droid -p <port> <ipaddr_of_phone>
```

> [!NOTE]
> `<ipaddr_of_phone>` can be inspected from your `Settings - About phone`

## Final Step

Finally you can type everything in your computer through SSH! So use nix as you like.
