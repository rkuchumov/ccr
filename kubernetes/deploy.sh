#!/bin/sh
echo "Let me show a magic trick!"

set -x

kubectl delete -f ./database-volume.yaml
kubectl delete -f ./database-volume-claim.yaml
kubectl delete -f ./database-deployment.yaml
kubectl delete -f ./database-service.yaml
kubectl delete -f ./app-deployment.modified.yaml
kubectl delete -f ./app-service.yaml

kubectl create -f ./database-volume.yaml
kubectl create -f ./database-volume-claim.yaml
kubectl create -f ./database-deployment.yaml
kubectl create -f ./database-service.yaml

sleep 5

cat app-deployment.yaml | sed "s/#ATATA/http:\/\/$(minikube ip)\//" > app-deployment.modified.yaml 
kubectl create -f ./app-deployment.modified.yaml
kubectl create -f ./app-service.yaml

minikube service app-service --url
