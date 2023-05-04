# cloud-native-kata-project

## Project Purpose

Flight Finder is a flight finding web-based micro-service application that finds cheapest flight prices for different destinations and show the user the cheapest found. Basically, the application allows the user to search and view flights.

## Contributors
 George Abot 

## Modules Expected
Number of modules: 5

## Languages and Frameworks:
  ## Front-end Technologies:
  
  1. Python
  2. Flask
  3. Html/CSS

  ## Backend Technologies:
  1. MongoDB - Database
  2. Mongoose - MongoDB Framework
  3. JavaScript - Server-side
  4. NodeJs - Server-side
  5. Express - Nodejs Framework

  ## Devops Technologies:
  1. Kubernetes
  2. Docker

## External Services
1. Kiwi Flight Search API(Tequila API) - watch the flights prices
2. AirLabs API - resolves airlines code to airline carier name e.g "F9" -> "Frontier Airlines"

## Primary UI Features
The user can perform the following operations:

1. Search Flights 
2. View Flights
3. Add source location 
4. Add the Destination
5. Add desired flight prices
6. View the desired flight information

## Run the app in Kubernetes
To run the app in Kubernetes, install Docker for Desktop Mac or Windows or choose GCP Kubernetes cluster. The folder k8s-kata-specifications contains all the YAML files for the app. Below are the steps for running the app in platforms:
1. First clone the project to GCP kubernetes cluster or local machine
```
    git clone https://github.com/Abotabraham/cloud-native-kata-project.git
```
2. Change directory to k8s-specifications
```
    cd k8s-specifications
```
3. Compile and run the shell script, deployment-script.sh
```
    chmod +x deployment-script 
    ./deployment-script
```

4. Check and watch if all the components are up and running
```
  kubectl get all
```
## Testing the App on Local Machine
Once all the services have been deployed, you can test the Flight Finder features as follows:

1. Search Flights base on the departure and destination city and max price. In your browser's address bar, enter the following:

  http://localhost:30001

2. View Flights from the database. In your browser's address bar, enter the following:

  http://localhost:30002

    ### Using Minikube Locally ? 
     1. Search Flights base on the departure and destination city and max price using service name of search microservice. This default web app to the browser
      ```
         minikube service search-service

      ```
    2. View Flights from the database using service name of view microservice. This default the web app to the browser
       ```
         minikube service view-service

      ```

## Testing the App on GKE
Once all the services have been deployed on the GKE cluster, you can test the Flight Finder features as follows:

1. Create a firewall rule to allow TCP traffic on the search-service and view-service node ports:
```
  gcloud compute firewall-rules create search-service-node-port --allow tcp:30001
  gcloud compute firewall-rules create search-service-node-port --allow tcp:30002

```

2. Find the external IP address of one of your nodes:
```
  kubectl get nodes -o wide

```
3. Search Flights base on the departure and destination city and max price. In your browser's address bar, enter the following:

   NODE_IP_ADDRESS:3001

4. View Flights from the database. In your browser's address bar, enter the following:
   
   NODE_IP_ADDRESS:30002

Replace the above placeholders with your:

    NODE_IP_ADDRESS: the external IP address of one of your nodes, found when creating the service in the previous task.

## Flight Finder Architecture

![Kata-architecture](kata-architecture.png)