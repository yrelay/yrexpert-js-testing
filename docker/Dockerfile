#!----------------------------------------------------------------------------!
#!                                                                            !
#! YRexpert : (Your Yrelay) Système Expert sous Mumps GT.M et GNU/Linux       !
#! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
#!                                                                            !
#!----------------------------------------------------------------------------!
# Dockerfile
#
# yrelay/yrexpert-js
# Version Docker d'YRexpert JS
#
# Consulter README.md pour plus d'informations sur ce fichier Docker
# Les instructions simples de construction/fonctionnement sont ci-dessous:
#
# Construire:
# $ docker build -t yrelay/yrexpert-js:latest .
# $ docker-compose build
#
# Utilisation avec la persistance des données:
# $ docker run --rm -e ydb_chset=utf-8 -v `pwd`/ydb-data:/data -ti yrelay/yrexpert-js:latest
#
# Accès au bach:
# $ docker run --entrypoint "/bin/bash" -ti yrelay/yrexpert-js:latest

# Étape 1: construire yrelay/yrexpert-js depuis l'image YottaDB
FROM yottadb/yottadb:latest

# Mise à jour de l'image YottaDB
ARG DEBIAN_FRONTEND=noninteractive
RUN \
  apt-get update && apt-get upgrade -y \
  && apt-get install -y libc6 nano sudo git \
  && locale-gen fr_FR.UTF-8 \
  && dpkg-reconfigure locales \
  && apt-get clean

# Installer la l'instance d'YRexpert - par défaut : yrelay
RUN \
  mkdir /tmp/yrelay \
  && cd /tmp/yrelay \
  && git clone https://github.com/yrelay/yrexpert-box-testing.git \
  && cd /tmp/yrelay/yrexpert-box-testing/debian \
  && ./installerAuto.sh -er


# Créer un acces SSH
# Pour connaitre l'IP de votre image (xxx.xxx.xxx.xxx) :
# $ docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ID_VOTRE_IMAGE
# Pour accéder à votre instance - par défaut : yrelay :
# $ ssh -p 2222 yrelay@xxx.xxx.xxx.xxx // mot de passe : yrelay
# $ ssh -p 2222 yrelayprog@xxx.xxx.xxx.xxx // mot de passe : prog
# $ ssh -p 2222 yrelayutil@xxx.xxx.xxx.xxx // mot de passe : util

# ENV NOTVISIBLE "dans le profil de l'utilisateur"

# RUN \
#   echo "export VISIBLE=now" >> /etc/profile \

#   apt-get update && apt-get install -y openssh-server \
#   mkdir /var/run/sshd \
#   echo 'root:root' | chpasswd \
#   sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config \
#   # Correctif de connexion. Sinon, l'utilisateur est lancé après la connexion \
#   sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

# EXPOSE 22
#CMD ["/usr/sbin/sshd", "-D"]
