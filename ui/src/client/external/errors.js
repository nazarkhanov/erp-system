export class WrongCredentials extends Error {
	message = "The username or password is incorrect!";
}

export class TokensNotFound extends Error {
	message = "Tokens not found!";
}

export class ExpiredTokens extends Error {
	message = "Tokens lifetime expired!";
}

export class Unknown extends Error {
	message = "An unknown error has occurred!";
}

export class NotFound extends Error {
	message = "Not found!";
}
