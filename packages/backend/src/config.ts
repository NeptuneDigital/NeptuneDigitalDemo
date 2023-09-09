/**
 * JWT config.
 */
export const config = {
	algorithms: ['HS256' as const],
	secret: 'shhhh', // TODO Put in process.env
};

export const uploadPath = './upload/';
export const projectRootDir =
	'/NeptuneDigital-demo/packages/backend';
