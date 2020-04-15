#!/bin/bash

# echo "
# allow-hotplug wlan0 
# iface wlan0 inet static 
# address 192.168.8.69
# netmask 255.255.255.0
# gateway 192.168.8.1
# wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
# " >> /etc/network/interfaces

timedatectl set-timezone Europe/Vilnius

NEW_NAME="tempy"
echo $NEW_NAME > /etc/hostname
sed -i "s/raspberrypi/$NEW_NAME/g" /etc/hosts
hostname $NEW_NAME

useradd -m -p GMgTkLb4bEhHI -s /bin/bash tangerine
usermod -a -G sudo tangerine

apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 2C0D3C0F
wget http://goo.gl/vewCLL -O /etc/apt/sources.list.d/rpimonitor.list
apt update -y
apt install -y rpimonitor
/etc/init.d/rpimonitor update -y

apt update -y
apt install -y screen i2c-tools git dirmngr

chmod 777 /dev/i2c-1
groupadd i2c
chown :i2c /dev/i2c-1
chmod g+rw /dev/i2c-1

usermod -aG i2c tangerine

wget https://nodejs.org/dist/v10.9.0/node-v10.9.0-linux-$(uname -m).tar.gz
tar -xvf node-v10.9.0-linux-$(uname -m).tar.gz
cd node-v10.9.0-linux-$(uname -m)
cp -R * /usr/local/

cd /home/tangerine && git clone https://github.com/VilniusTechnology/tangerine-nest.git

# apt update -y
# apt upgrade -y

reboot