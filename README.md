# Set up MongoDB Replica-set for development ONLY using Docker

## Getting Started

Most of the stuff here will work out-of-the-box, and the containers will be up and running once you run `docker-compose up -d`.
However, there are a few configuration steps that you would need to incorporate - which are mentioned below.

### Configure environmental variables

If you check the `docker-compose.yml` file, we are relying on `.env` file to populate the env variables for the compose.
A `sample.env` file is provided here, use it to create your own `.env` file.

### Create keyfiles for MongoDB nodes to authenticate themselves

For this we need to create a keyfile.

In Linux, the following are the commands:
```bash
openssl rand -base64 700 > file.key
chmod 400 file.key
sudo chown 999:999 file.key
```

Follow the steps above to generate a new `file.key`.  It's optional because i have already added a working key file.

### Update hostnames

Once the replica set is up, you will need to update hostnames in local `/etc/hosts` file.

<details><summary>Sample entry</summary>
<p>

```bash
127.0.0.1 localhost mongo1 mongo2 mongo3
```

</p>
</details>

This change is needed to be done in all client machine, from where you would like to connect to this Replica Set.
So if you are running this replica set in your local development machine, and want to connect to it, you would have to update `/etc/hosts` file in your local dev machine ONLY.
However, if you want to connect to this replica set from a different machine, you would need to update the `/etc/hosts` file in that other machine as well.

<details><summary>Sample entry on a different machine</summary>
<p>

```
10.20.30.40 mongo1 mongo2 mongo3
```

Here, `10.20.30.40` is the public-ip of the machine where this replica set is running.
</p>
</details>


**NOTE:** In windows, the hosts file is located at `C:\Windows\System32\drivers\etc\hosts`


## Result
Once the MongoDB replica set is up and running, Once everything comes up, you can run `docker-compose status`, and see something like this:


To connect to the replica set, you can use mongo client.
<details>
<summary>Connect to replica set running on local machine</summary>
<p>

```bash
$ mongo "mongodb://<MONGO_INITDB_ROOT_USERNAME>:<MONGO_INITDB_ROOT_PASSWORD>@localhost:30001,localhost:30002,localhost:30003/<MONGO_INITDB_DATABASE>?replicaSet=rs0" --authenticationDatabase admin
```

</p>
</details>

</br>

## Configuration for .env file in backend and tx-processor

<p>
```
DOCUMENTDB_USER=root
DOCUMENTDB_PASSWORD=rootpassword
DOCUMENTDB_HOST=localhost:30001,localhost:30002,localhost
DOCUMENTDB_PORT=30003
DOCUMENTDB_DB=nft-marketplace
```
</p>