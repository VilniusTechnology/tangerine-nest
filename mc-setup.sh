touch /Volumes/boot/ssh;
touch /Volumes/boot/wpa_supplicant.conf;
echo "
country=LT
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid=\"Lietuva\"
    psk=ae82b5031ef024db1dc80ec7d12fca8e95a2a246bb4e34fa9de509586e49834a
}

" >> /Volumes/boot/wpa_supplicant.conf;
cp boot-setup.sh /Volumes/boot/firstboot.sh;

diskutil unmount boot;