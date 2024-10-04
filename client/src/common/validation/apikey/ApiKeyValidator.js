/**
 * Validate that the input is suitable to be used as a job name.  This only checks that the name
 * doesn't have any invalid characters, etc, not that the name isn't already in use
 * by another job.
 * 
 * @param {*} input 
 */
export const PATTERN__VALID_API_KEY_NAME = "^[a-zA-Z0-9\\ \\-\\_\\.]{3,50}$";


/**
 * Check if the supplied input would be valid as an API key name
 * 
 * @param {*} input 
 * @returns true of the input doesn't contain any invalid characters, false otherwise
 */
export function isValidApiKeyNameValue(input) {
    let ret = true;

    if (input === null) {
        // null input is not at all valid
        ret = false;
        return ret;
    }

    let trimmedInput = input.trim();
    if (trimmedInput === '') {
        // blank input is not at all valid
        ret = false;
        return ret;
    }

    let pMatch = trimmedInput.match(PATTERN__VALID_API_KEY_NAME);
    if (pMatch === null) {
        ret = false;
    }

    return ret;
}

/**
 * Check if the name the user wants as the api key name is already in use.  if it is, they'll have to choose another name.
 * 
 * @param {*} baseUrl Base url to fetch api keys with
 * @param {*} keycloakToken Our keycloak token to authenticate with
 * @param {*} prefix If supplied, it means we are editing an existing api key and if a result comes for prefix id we'll allow it since it's updating the name on the same api key
 * @param {*} name The name we are checking is in use or not
 * @param {*} resultCallback A function that we'll call with the final result of true or false
 * 
 * @returns true if the name is already in use by an existing api key, false otherwise
 */
export function apiKeyNameIsInUse(baseUrl, keycloakToken, prefix, name, fieldIsValidCallback,
    fieldErrorMessageCallback) {

    // build the url
    let fetchUrl = baseUrl + "?name=" + name;

    fetch(fetchUrl, {
        method: 'GET',
        headers: {
            'access-token': keycloakToken
        },
    })
        .then((response) => response.json())
        .then((respData) => {
            let existingPrefix = null
            let inUse = false;

            // webservice response
            // {
            //     "count": 1,
            //     "next": null,
            //     "previous": null,
            //     "results": [
            //         {
            //             "id": "BXRqyPr4.pbkdf2_sha256$150000$vdTdWBpS91i2$LmKtdDx5bvtFot0Olurc57njKUEJ965Teui8G0aTCZI=",
            //             "created": "2022-06-25T15:58:31.513439Z",
            //             "name": "scan_alerts_api_key",
            //             "revoked": false,
            //             "expiry_date": "2022-12-08T14:27:28Z",
            //             "hashed_key": "pbkdf2_sha256$150000$vdTdWBpS91i2$LmKtdDx5bvtFot0Olurc57njKUEJ965Teui8G0aTCZI=",
            //             "prefix": "BXRqyPr4"
            //         }
            //     ]
            // }
            
            if (respData.results.length > 0) {
                // should be only one result
                let entry = respData.results[0];
                existingPrefix = entry['prefix'];
            }

            if (prefix !== null) {
                // we are editing an existing api key, so if existingPefix != null but equals
                // the prefix of the api key we are editing, it's no issue
                if (existingPrefix !== null) {
                    if (existingPrefix !== prefix) {
                        // another api key has this name so we must force the user to pick something else
                        inUse = true;
                    }
                    else {
                        // since this name exists on the api key we are editing, we'll not say the name is already in use
                        // by another api key
                    }
                }
                else {
                    // there is no api key with this name, all good
                }
            }
            else {
                // since id is null here, we are likely adding a new job that doesn't have an id yet
                // we we are simply interested if any job exists with this name already
                if (existingPrefix !== null) {
                    // an existing job has this name already
                    inUse = true;
                }
            }

            if (inUse) {
                fieldIsValidCallback(false);
                fieldErrorMessageCallback("This name is in use by api key, please pick another name");
            }
            else {
                fieldIsValidCallback(true);
                fieldErrorMessageCallback("");
            }
        });
}
