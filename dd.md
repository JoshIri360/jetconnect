#Create Booking (Admin Only)

Create a new booking

### Request

`POST /api/v1/bookings`

### Response

#### Success

Status code: `200 OK`

Example response body:

JSON

```
{    "status": "success",    "data": {        "data": {            "firstName": "Joy",            "lastName": "Olalleye-Jesse",            "email": "joy@gmail.com",            "password": "$2b$10$F2g4ApUix1rUZub1FEJenOjykqZ6W3VAqMPKKvKpvE5j2xehSMih6",            "role": "admin",            "_id": "6401cf3b4cb7f59930c450b6",            "__v": 0        }    }}
```

#### Error

Status code: `400 Bad Request`

Example response body:

JSON

```
{   "status": "fail",   "message": "Duplicate value error"}
```

JSON

```
{    "status": "Error",    "message": "Something went wrong"}
```