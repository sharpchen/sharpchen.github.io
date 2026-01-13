# How to Install System

## Disk Partitioning & Formatting

### Disk & Partition & Volume

**Disk** is a physical storage device that can be logically recognized by operating system as a **whole**.
A disk can be split into multiple **logical partition**, a partition means a address of address of the disk managed by certain **partition table**.
A partition can have certain **file system format** which describes the advance abstraction of storage units, also instructs the system how to manipulate these storage.
Such partition abstracted as file system format is so called **volume**.

> [!NOTE]
> Operating system lives in a disk, so you would probably need to run installer on a external storage(such as USB stick) when installing a new system.

### Partition Style(Scheme)

The form of how a physical disk was partitioned is so called *Partition Style* or *Partition Scheme*.

- GPT: GUID Partition Table
- MBR: Master Boot Record

Partition scheme is recognized by certain byte in partition table.

> [!IMPORTANT]
> Whether a partition scheme is supported depending on the **firmware** of your machine.
> That is because firmware is the layer instructs the system how to read and write the disk.

> [!NOTE]
> A uninitialized disk has partition scheme `RAW` which means no partition table available.

> [!NOTE]
> You might have heard of *primary partition* and *extended partition*, those are only specific to MBR scheme.
> MBR scheme only allow one partition to be file system, the one partition is so called *primary partition*.
> GPT scheme doesn't have such limit, every partition in GPT scheme is equivalent of primary and can be formatted as file system.

### Mounting

Mounting is simply to assign a starting point to the partition so that the file system can represent its content in absolute path.
It's yet another abstraction over partition

On Windows you assign the partition a drive letter(such as `C:`) to mount a partition.
On Linux you should mount conventionally to `/mnt/...`.

### Volume

A volume is a system abstraction wrapping over **formatted** partition that describes something more than storage boundaries and offsets,
such as *total size*, *remaining size*, *file system type* etc.
So volume is not a real thing, but an aggregation over the partition, a logical presentation of partition.

### File System Format

File system formats are predefined rules for reading/writing chunks of storage, they're standards to be implemented by the operating system.
The operating system can identify the format by reading the certain byte of certain sector, and then the system would know how to manipulate the storage, as long as the format standard is implemented.

## What is Firmware

Firmware is the most primitive layer built in the motherboard(hardware), it's specific to your machine.

- **UEFI**: Unified Extensible Firmware Interface
- **BIOS**: Basic Input/Output System

Firmware also manages some fundamental drivers, such as keyboard driver so that you can use keyboard when no system was yet installed.

> [!NOTE]
> Note that extra drivers are still managed by the operating system you install.

### EFI System Partition

**EFI System Partition(ESP)** is a *primary partition*(aka file system) to store critical files/executables to boot the system.

- **EFI system partition**:
    - generally formatted as **FAT32**
    - has GUID `C12A7328-F81F-11D2-BA4B-00A0C93EC93B` as identifier in **GPT**

> [!NOTE]
> On windows you can mount EFI partition using `mountvol`, note that this is only temporarily accessible during current shell session.
>```sh
>mountvol z: /s # mount EFI partition to z:
># now you can inspect what's inside EFI partition
>mountvol z: /d # unmount z:
>```

#### How Large Should It Be?

If you inspect Windows EFI partition using the method noted above, you would find that the total is merely under 60MB for most cases.
On Linux you might find it find it even smaller(probably under 30MB, depending on which bootloader you use).
So it doesn't really matter much as long as you're not a cheapskate on storage, I would say 512MB is large enough to cover most system/bootloader.
But that's only relevant when you only install one system on one disk, if you decided to share the same EFI partition with multiple systems, the size should be considered based on conditions.

### Firmware Boot Manager

As [UEFI specification](https://uefi.org/specs/UEFI/2.10/03_Boot_Manager.html#firmware-boot-manager) describes:

> The boot manager is a component in firmware conforming to this specification that determines which drivers and applications should be explicitly loaded and when.
> Once compliant firmware is initialized, it passes control to the boot manager.
> The boot manager is then responsible for determining what to load and any interactions with the user that may be required to make such a decision.

Firmware Boot Manager generally implemented by the hardware manufacturer.
It is exactly the implementation of the UEFI boot menu, to manage the boot entry order, you may also manipulate the order from a system that harnesses certain UEFI interface.

### Firmware Application

If you inspect the EFI partition of you disk, you should see some `.efi` files.
Those files are executable by the UEFI, more specifically, by the Firmware Boot Manager.
The application can be *System Boot Manager* or *bootloader* etc.
Firmware Boot Manager passes the control after launching the application.

### Firmware Boot Entries

A boot entry describes which Firmware Application to execute when UEFI triggers it.
Such entries are stored in [NVRAM](https://en.wikipedia.org/wiki/Non-volatile_random-access_memory)which is managed by UEFI.

For example, on EFI partition for Windows you would find a `\EFI\Microsoft\Boot\bootmgfw.efi`, which is the *Windows Boot Manager* to be started on boot.
You are able to inspect the default UEFI boot entry info object described by Windows using `bcdedit`:

```console
PS> bcdedit /enum '{bootmgr}'

Windows Boot Manager
--------------------
identifier              {bootmgr}
device                  partition=\Device\HarddiskVolume1
path                    \EFI\Microsoft\Boot\bootmgfw.efi
description             Windows Boot Manager
locale                  zh-CN
inherit                 {globalsettings}
isolatedcontext         Yes
default                 {current}
resumeobject            {129c7077-f492-11eb-917c-f4378a725ae7}
displayorder            {current}
toolsdisplayorder       {memdiag}
timeout                 0
```

> [!NOTE]
> Note that *Windows Boot Manager* is listed as a special firmware application by `bcdedit`. Other applications are just simply listed as *Firmware Application*

And you should find that `{bootmgr}` is the first entry of firmware boot manager config(`{fwbootmgr}`), meaning that *Windows Boot Manager* is the first UEFI entry and `\EFI\Microsoft\Boot\bootmgfw.efi` will be launched.

```console
PS> bcdedit /enum '{fwbootmgr}'

Firmware Boot Manager
---------------------
identifier              {fwbootmgr}
displayorder            {bootmgr}
                        {e89044d4-c934-11ea-862e-806e6f6e6963}
                        {e89044d5-c934-11ea-862e-806e6f6e6963}
                        {e89044d6-c934-11ea-862e-806e6f6e6963}
timeout                 0
```

Boot entries are managed by firmware as a **stack**, entries on top loads first, if previous one fails to boot, it **fallback** to next entry.

You can either manipulate boot entries in firmware or using specific command line utility.
- Windows: `bcdedit`
    - can manage boot order/entries of Windows Boot Manager in `EFI/Microsoft/Boot/BCD`
    - can alter boot order/entries of Firmware Boot Manager in NVRAM  <!-- TODO: examine it using ventoy USB drive -->
- Linux: `efibootmgr`
    - alters firmware config in NVRAM

> [!NOTE]
> You can always boot system from firmware but that requires moving up/down boot entries for each time you want to selectively boot.
> This is exactly the pain point boot manager came to resolve.

### System Boot Manager

As aforementioned, *System Boot Manager* is a special kind of Firmware Application knows how to selectively and interactively enter a operating system.
One EFI partition might contain multiple system boot managers, you should pick the favorite so that each time you launch the machine it will prompt to choose which system to boot.

#### Prioritize a Boot Manager

Different system can have their bootloaders in EFI partition, you can pick the favorite to use.

Windows has a `bcdedit` cli to manipulate UEFI entry order.
For Windows `EFI/Microsoft/Boot/bootmgfw.efi` in EFI partition is the **Windows Boot Manager** to be recognized by UEFI.
You can either override the target path of `{bootmgr}` or create a new entry object and add it to the top of `{fwbootmgr}`

::: code-group

```ps1 [Override {bootmgr}]
# {bootmgr} is the identifier of boot manager entry object
bcdedit /set '{bootmgr}' path \EFI\ubuntu\grubx64.efi
```

```ps1 [Add new entry]
$guid = & {
    $null = (bcdedit /copy '{bootmgr}' /d "Ubuntu Secure Boot") -match
        '\{[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\}'
    $matches[0]
}

bcdedit /set $guid path \EFI\ubuntu\grubx64.efi
```

:::

You should double check whether `{bootmgr}`/new entry is the topmost entry of firmware boot manager(`{fwbootmgr}`)

```ps1
PS> bcdedit /enum '{fwbootmgr}'

Firmware Boot Manager
---------------------
identifier              {fwbootmgr}
displayorder            {bootmgr} # [!code highlight]
                        {e89044d4-c934-11ea-862e-806e6f6e6963}
                        {e89044d5-c934-11ea-862e-806e6f6e6963}
                        {e89044d6-c934-11ea-862e-806e6f6e6963}
timeout                 0
```

**If not**,  you should prepend it to `displayorder` of `{fwbootmgr}`.

```ps1
# prepend {bootmgr} as topmost entry of {fwbootmgr}
bcdedit /set '{fwbootmgr}' displayorder '{bootmgr}' /addfirst
```

### Booting Process

1. UEFI started
2. UEFI launch a bootloader(can be a boot manager)
3. Initializing system kernel, mounting storages etc.

## How to Install a System

### Using Pre-installation Environment

