import b2sdk.v2
import os

def account_credentials():
    info = b2sdk.v2.InMemoryAccountInfo()
    api = b2sdk.v2.B2Api(info)
    appKeyId = os.getenv("ACCOUNT_ID")
    appKey = os.getenv("APPLICATION_KEY")
    api.authorize_account("production", appKeyId, appKey)
    return api

def findBucket(api):
    return api.get_bucket_by_name(os.getenv("BUCKET_NAME"))