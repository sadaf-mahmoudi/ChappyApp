### user:

| Method | URL               | body        | Response                                                                 |
| :----: | :---------------- | :---------- | :----------------------------------------------------------------------- |
|  GUT   | /api/             | -           | UserList.                                                                |
|  GUT   | /api/id/          | -           | searching users by id.                                                   |
|  GET   | /api/user/login   | -           | Answer 404: Not found if user is unauthorized.                           |
|  GET   | /api/user/search  | -           | searching users by a query string (e.g., username).                      |
|  POST  | /api/user/addUser | -           | Adding User.                                                             |
|  PUT   | /api/user/id      | -           | Updating users by id.                                                    |
| DELETE | /api/user/id      | -           | Deleting users by id.                                                    |
|  POST  | /api/user/        | User-object | 400: Error searching users<br>400: Failed to create user.Invalid data.   |
|  PUT   | /api/user/:id"    | User-object | 200: User updated successfully.<br>404: No user found with the given ID. |
| DELETE | /api/user/:id"    | user-object | 400: Invalid user ID format. <br> 404: No user found or deletion failed. |

<br>

### dm:

| Method | URL                                | body | Response                               |
| :----: | :--------------------------------- | :--- | -------------------------------------- |
|  GET   | /api/                              | -    | List of dm-objects.                    |
|  POST  | /api/dm/                           | -    | 201:DM created successfully.           |
|  GET   | /api/dm/:senderName/:receiverName" | -    | 404:No mess found between these users. |
| DELETE | /api/dm/id                         | -    | 200:deleted.<br>400:Invalid ID format. |

<br>

### room:

| Method | URL                  | body | Response                                                |
| :----: | :------------------- | :--- | :------------------------------------------------------ |
|  GET   | /api/room            | -    | List of room-objects.                                   |
|  POST  | /api/:roomId/message | -    | 201: Message added <br>500: Failed to add message       |
| DELETE | /api/room/id         | -    | 200: Room deleted successfully <br>404: Room not found. |

<br>

### roomMessage:

| Method | URL                               | body | Response                                      |
| :----: | :-------------------------------- | :--- | :-------------------------------------------- |
|  GET   | /api/message/getMessage/:roomName | -    | List of room-messages-objects.                |
|  POST  | /api/message/:roomId/message      | -    | 201: Created <br> 500: Failed to add message. |
|  POST  | /api/message/addMessage           | -    | 201: Message created successfully             |

### Interfaces:

<br>

##### User:

| username | email  | image  | password |
| :------- | :----- | :----- | :------- |
| string   | string | string | string   |

<br>

##### LoginResult:

| success | message | user? |
| :------ | :------ | :---- |
| boolean | string  | User  |

<br>

##### Room:

| name   | isActive | image  |
| :----- | :------- | :----- |
| string | boolean  | string |

<br>

##### DmMessage :

| message | receiverNam | senderName | timestamp |
| :------ | :---------- | :--------- | --------- |
| string  | string      | string     | Date      |

<br>

##### MessageRoom:

| senderName | content | roomId | timestemp |        |
| :--------- | :------ | :----- | --------- | ------ |
| string     | string  | string | Date      | string |

<br>
<br>

Published webpage: 