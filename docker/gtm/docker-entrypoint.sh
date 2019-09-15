#!/usr/bin/env bash
#!----------------------------------------------------------------------------!
#!                                                                            !
#! YRexpert : (Your Yrelay) Système Expert sous Mumps GT.M et GNU/Linux       !
#! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
#!                                                                            !
#!----------------------------------------------------------------------------!
# docker-entrypoint.sh

# Le nom ou l'identifiant du conteneur docker peut être donné en paramètre
CONTAINER=$1

if [[ "$CONTAINER" == "" ]]; then
  # si aucun identifiant n'est donné, connectez-vous simplement au premier conteneur en cours d'exécution
  CONTAINER=$(docker ps | grep -Eo "^[0-9a-z]{8,}\b")
fi

#clear

echo '!-Liste des conteneurs-----------------------------------------------------!'
echo
docker ps
echo

echo '!-Liste des images---------------------------------------------------------!'
echo
docker images -a
echo

echo '!-IP du contenueur actif---------------------------------------------------!'
echo
echo 'Conteneur = ' $CONTAINER

if [[ "$CONTAINER" == "" ]]; then
  # si aucun conteneur n'est identifié : ne rien faire !
  echo 'Pour avoir une adresse IP lancer un conteneur.'
  else
  echo 'IP = ' `docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $CONTAINER`
fi
echo

service ssh restart
service yrelayyrexpert restart
service yrelayyrexpert-js restart
bash