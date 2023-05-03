#!/bin/bash

# Set the Kubernetes namespace you want to deploy resources to
NAMESPACE="default"

# Loop through all YAML files in the current directory and deploy them
for manifest in *.yaml
do
  kubectl apply -f "$manifest" --namespace "$NAMESPACE"
done