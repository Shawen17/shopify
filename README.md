## Shopify and ERP Syncronization

This app was deployed with docker compose and has three services;
* frontend service powered by React
* backend service powered by Node.js (Express.js)
* dataase service powered by Mariadb (SQL DB)

This app interacts with ERP DB (mariadb) via a sequelize model and it utilizes the transaction method of sequelize to achieve atomic transaction during the process of creating, 
updating or deleting the customers model instance. This ensures that both the ERP and Shopify Databases are updated at the same time for every operation, so if a failure occur with 
either the ERP server or Shopify service (due to network failure or rate limiting), both operation will fail and the servers maintain their initial state. 

Secondly, a company model which will be a foreignkey to the customer model is created and maintained only in the ERP as Shopify has no API support for companies. Due to the possibility of 
Shopify network issue, a retry for up to five times with an exponential increase in time delay for each attempt has been implemented for every Shopify Api call.

Finally, winston library was used to log error and info to both console and a file log system that can be hosted on any platform.
