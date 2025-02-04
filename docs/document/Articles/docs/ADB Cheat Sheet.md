# ADB Cheat Sheet

## Device Codename

```sh
adb shell getprop ro.product.device
```

## Flash System with ADB

- (optional) flash recovery with fastboot

```sh
fastboot flash recovery /path/to/recovery.img
```

- reboot to recovery
```sh
adb reboot recovery
# or
fastboot reboot recovery
```

- enable adb sideload in recovery
- factory reset(wipe data)

- flash by adb sideload

```sh
adb sideload /path/to/rom.zip
```

## ABI

```sh
adb shell getprop ro.vendor.product.cpu.abilist64
adb shell getprop ro.vendor.product.cpu.abilist # all abi
```
