export enum ROLES {
  admin,
  student,
  secretary,
  instructor,
}

export interface User {
  id: number;
  fs_name: string;
  ls_name?: string;
  nick_name?: string;
  email: string;
  phone?: "123456789";
  avatar?: string;
  adresse_physique?: string;
  pays_residance?: string;
  ville_residance?: string;
  date_of_birth?: string;
  num_piece_identite?: string;
  createdAt?: Date;
  role: ROLES;
}

/*

  "roles": [
                {
                    "id": 1,
                    "role": "Admin",
                    "HasRoles": {
                        "id": 1,
                        "UserId": 1,
                        "RoleId": 1,
                        "status": 1,
                        "createdAt": "2025-05-08T22:01:09.163Z",
                        "updatedAt": "2025-05-08T22:01:09.163Z"
                    }
                },
                {
                    "id": 4,
                    "role": "Étudiants",
                    "HasRoles": {
                        "id": 8,
                        "UserId": 1,
                        "RoleId": 4,
                        "status": 1,
                        "createdAt": "2025-05-15T08:46:08.802Z",
                        "updatedAt": "2025-05-15T08:46:08.802Z"
                    }
                },
                {
                    "id": 2,
                    "role": "Secrétariat & Administratif",
                    "HasRoles": {
                        "id": 9,
                        "UserId": 1,
                        "RoleId": 2,
                        "status": 1,
                        "createdAt": "2025-05-15T08:47:35.672Z",
                        "updatedAt": "2025-05-15T08:47:35.672Z"
                    }
                },
                {
                    "id": 3,
                    "role": "Formateurs",
                    "HasRoles": {
                        "id": 24,
                        "UserId": 1,
                        "RoleId": 3,
                        "status": 1,
                        "createdAt": "2025-06-11T10:26:46.043Z",
                        "updatedAt": "2025-06-11T10:26:46.043Z"
                    }
                }
            ]
        }
    }
}
    */
