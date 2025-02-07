
# The new CYB website

## cyb.no + in.cyb.no

CYB has previously had a separate volunteer system and website, both of which were maintained by the IT group (previously X-group). After the old volunteer system unfortunately stopped being maintained and (eventually) stop functioning, CYB lost access to tools for logging volunteer hours, tracking the stock in Escape, and managing membership. 

After a grueling semester of google sheets and paper logs, we have finally gotten the new system live! Previously the volunteer system and the main CYB website have been separate, but in an attempt to make the main website more appealing, the two have been merged into a single resource.

Visit the website at [cyb.no](https://cyb.no)

## Tech stack

This is more or less the tools used to create the website.

![current_tech_stack](https://github.com/user-attachments/assets/6ecb70d6-a299-4496-ae63-2572730de77d)

## Hosting

* Domain registrar: domeneshop
* DNS provider: Cloudflare
* VPS: NREC


## How to contribute?
See [contributing](CONTRIBUTING.md) for more information. This also provides a guide to set up a local docker container for your own instance of the cyb database.

## How to run a local dev instance

A development database and environment file have been developed so that volunteers may test the website locally.

Steps :
1. Clone the repository to your computer: `git clone https://github.com/cybernetisk/internsystem-v2.git`

2. Create a file named `.env.development.local` and add the following variables:

```.env.development.local
DATABASE_USER = 'internsystem_v2_dev'
DATABASE_PASS = 'rp_C4N8^ev2I!vS^fbIkEub4'
DATABASE_SCHEMA = 'ISV2_development'
DATABASE_URL = "mysql://${DATABASE_USER}:${DATABASE_PASS}@localhost:3307/${DATABASE_SCHEMA}"

NEXTAUTH_URL = 'http://localhost:3005'
NEXTAUTH_CALLBACK = '/'
NEXTAUTH_SECRET = 'QuTxFdD3yon9X+83rRaio/vSgkfhvnwUglcIrnUwTLA='

NODEMAILER_NOREPLY_USER = 'noreply@cyb.no'
NODEMAILER_NOREPLY_PASSWORD = 'dvlk nswm cxbq qnds'

NEXT_PUBLIC_SANITY_API_VERSION = '2024-02-23'
NEXT_PUBLIC_SANITY_DATASET = 'production'
NEXT_PUBLIC_SANITY_PROJECT_ID = 'p4dmwf04'
```

3. Install npm

4. Install dependencies: `npm install`

5. Create an ssh-key file named `dbtunnel_ssh` and add the following private key:

```
-----BEGIN OPENSSH PRIVATE KEY-----
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
-----END OPENSSH PRIVATE KEY-----
```

7. In a separate terminal, connect to the databse using an ssh-tunnel: `ssh -L 3307:localhost:3306 -i ~/.ssh/dbtunnel_ssh dbtunnel@158.39.200.46 -N`

8. Generate database adapter client: `npx prisma generate`

9. Start a development environment: `npm run dev`

10. Navigate to the development endpoint: `http://localhost:3005`

BTW: Notify easvebak@cyb.no if you are able to somehow gain access to the VPS, and you will be given 5 vouchers. (this is not a challenge, lol)
