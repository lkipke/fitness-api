mongosh <<EOF
use $MONGO_DB_DATABASE

db.createUser(
  {
      user: '$MONGO_DB_USER',
      pwd: '$MONGO_DB_PASSWORD',
      roles: [
          {
              role: "readWrite",
              db: '$MONGO_DB_DATABASE'
          }
      ]
  }
);
EOF
