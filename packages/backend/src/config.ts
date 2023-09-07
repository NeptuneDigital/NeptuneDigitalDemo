/**
 * JWT config.
 */
export const config = {
	algorithms: ['HS256' as const],
	secret: 'shhhh', // TODO Put in process.env
};

export const uploadPath = './upload/';
export const projectRootDir =
	'/Users/mac/腾讯/Macbook_tencent/Library/Containers/com.tencent.WeWorkMac/Data/WeDrive/腾讯/我的文件/技术和研发/公链方向学习/底链学习/BSN生态/NeptuneDigital-demo/packages/backend';
