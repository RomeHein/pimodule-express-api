# PiModule express API

A node package to expose your UPS PIco HV3.0A/B/B+ HAT features on an express api

This library was not developped by the PiModules(R) UPSPIco company.
Any query/issue concerning their product won't find answers here, sorry :/ Feel free to refer to their official github repo:
https://github.com/modmypi/PiModules

The main goal of this module is to expose **on your local network** PiModule's features. I would recommand against exposing this API to the world. If you really need to, I would use a reverse proxy like nginx.

## Getting Started

This server is just a REST wrapper of the PiModule Helper library.
Once the server is up and running, you should be able to use PiModule's main features.

GET:
- pimodule temperature
- powering mode (battery or power)
- battery level
- buzzer state
- relay state
- pimodule running state
- auxilary power state
- leds state
- fan running, fan mode, fan speed, fan temperature treshold
SET: 
- shutdown timer, stop shutdown
- powering mode (battery or power)
- backed auxilary power
- buzzer
- Generate sounds
- bistable relay state
- leds (orange, green, blue)
- Fan mode (automatic, manual, disable), fan speed, fan temperature treshold

### Prerequisites

You'll need a UPS PIco HV3.0A/B/B+ HAT, you can order it here:
https://pimodules.com/plus-advanced

You'll also need to get the installation process right.
This process is described in the pimodule library:
https://github.com/RomeHein/pimodule
It's possible to use the same process directly with this module by running ``` npm install ``` every time your clone this repo.
This will install the pimodule library depency and then give you access to the installation scripts via `node_module/pimodule`

Two ways: via Ansible, or via the provided installer.sh script

- Ansible
Make it easy to reproduce via Ansible in case your rasperry pi fails!
To use the playbook provided, just clone this repository on your dev machine:

```
    git clone https://github.com/RomeHein/pimodule-express-api.git
```

Then run ```npm i``` into it.
You will also need Ansible installed.
Make sure to change your raspberry pi local address/user in the following command:
```
    cd node_module/pimodule/ansible
    ANSIBLE_HOST_KEY_CHECKING=false ansible-playbook pimodule.yml -i raspberrypi.local, --user=pi --ask-pass
```

- Installer.sh
Just copy past the script present in the pimodule library on your raspberry pi. 
Make sure you have the right permissions to run the script:
```
    chmod +x installer.sh
```
And run it with sudo:
```
sudo ./installer.sh
``` 

### Installing

Depending on your requirements, three possibilities:

- Use directly from code

This is not the best method, but the less dependant on other technologies.
clone the repo in whatever folder you wish:
```
git clone https://github.com/RomeHein/pimodule-express-api.git
```
cd into the folder and then:
```
    npm i
```
And run the server with
```
    npm start
```
Too easy

- Docker
I would say that is a more robust solution. You'll need docker and docker-compose installed on your Raspberrypi.
You still need to clone the repo:
```
git clone https://github.com/RomeHein/pimodule-express-api.git
```
Then 
```
docker build -t pimodule-api .
```
Once done, run the container just created:
```
docker-compose up -d
````

☝️ Some customizations needed here

Three env variables are available:
- API_PORT: define the port expose by the api. Default to 7070
- ADDRESS_TYPE: define addresses that should be uses by the UPS PIco HV3.0A/B/B+ HAT. Three are availble: 'default', 'alternate', 'noRtc'. If you don't know what I2C means, this variable should not be used
- PASS: if you want to secure slightly your api, you can provide a pass. Your non-hashed password should be used with env variable PASS. The hashed pass (token) should be used when requests are made to the api, in the Authorization header. The server will just make a quick `bcrypt.compare` check before reading any incoming requests.
The token will be print in the log of the server. You can of course use any bcrypt online generator.

```
PORT=8080 ADDRESS_TYPE=alternate HASHED_PASSED=$2y$12$IaMsT4MWiLkPI1IUVtO0GuDHoDxuh4RllAwGcaz7KFnKGtvbJa22m docker-compose up -d
```

### Usage
Connect to your local network and then via postman or any web browser:
```
    http://raspberrypi.local:7070/pimodule/state
```
That should tell you if the PiModule is running properly.

You can have access to the full API documentation directly via (once you've got your server running):
```
    http://raspberrypi.local:7070/doc
```

## Running the tests

```
npm run test
```

## Contributing

All pull requests/suggestions are welcome

## Authors

* **Romain Cayzac**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
