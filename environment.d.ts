namespace NodeJS {
  interface ProcessEnv {
    TEST: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    REFRESH_SECRET: string;
    API_KEY: string;
  }
}

interface ICustomUser {
  displayName: string;
  email: string;
  password?: string;
  authType: string;
  avatar?: string;
  friends?: ICustomUser[];
}


