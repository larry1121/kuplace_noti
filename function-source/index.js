const functions = require('firebase-functions');
const admin = require('firebase-admin');
let serAccount = require('./officialpractice-bfcfa-firebase-adminsdk-sd5hd-b17884be7a.json')
admin.initializeApp(
    {
        credential: admin.credential.cert(serAccount),
      }
);
const db = admin.firestore();
/**
 * Triggers when a user gets a new follower and sends a notification.
 *
 * Followers add a flag to `/followers/{followedUid}/{followerUid}`.
 * Users save their device notification tokens to `/users/{followedUid}/notificationTokens/{notificationToken}`.
 */
exports.sendReplyNotification = functions.region('asia-northeast3').firestore
.document('/buildings/{mBuildingkey}/posts/{mPostkey}/replies/{replyKey}')
    .onCreate(async(snap, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}


        mBuildingkey = context.params.mBuildingkey;
        mPostkey=context.params.mPostkey;
        mpostUID=[]
        mpostTitle=[]
        mreplyBody=snap.data().replyBody
        mreplyUID=snap.data().replyUID

        // functions.firestore.document('/buildings/${mBuildingkey}/posts/${mPostkey}')
        await db.collection("buildings").doc(mBuildingkey).collection("posts").doc(mPostkey).get()
        .then(async(doc) => {
            if(doc.exists){
                // console.log(doc.id);

                mpostTitle.push(doc.data().postTitle);
                mpostUID.push(doc.data().postUID);
                console.log("postUID is",doc.data().postUID);
                // console.log(doc.data().created);

            }




            });
        //댓쓴이=글쓴이이면 끝냄
        if(mreplyUID==mpostUID[0]){
            return;
        }


        //console.log("postUID is",a);
        const payload = {
            notification: {
              title: '댓글알림',
              body: `${mpostTitle[0]} 글에 댓글이 달렸습니다!`,
              click_action: "FCM_MY_POST_ACTIVITY"


            },
            data : {
                "mBuildingkey" : mBuildingkey,
                "mPostkey" : mPostkey,
                "click_action" : "FCM_MY_POST_ACTIVITY",
                "mpostTitle" : mpostTitle[0],
                "mreplyBody" : mreplyBody
              }
          };

        var tokens = [];

        // FireStore 에서 데이터 읽어오기
        await db.collection('users').doc(mpostUID[0]).get().then((doc) => {
            if(doc.exists){

                if(doc.data().notificationSettings==false){
                    return;
                }else{
                    tokens.push(doc.data().FCMtoken);
                }


            }
            });

            console.log(tokens);


            if (tokens.length > 0 ){
                admin.messaging().sendToDevice(tokens, payload)
                .then(function(response) {
                    // See the MessagingDevicesResponse reference documentation for
                    // the contents of response.
                    console.log('Successfully sent message:', response);
                })
                .catch(function(error) {
                    console.log('Error sending message:', error);
                });

            }

        })
////////////////////////////////////////////////////////////////////////////////////////////////////////////
        exports.sendRereplyNotification = functions.region('asia-northeast3')
            .firestore.document('/buildings/{mBuildingkey}/posts/{mPostkey}/replies/{replyKey}')
            .onCreate(async(snap,context) => {
                mBuildingkey = context.params.mBuildingkey;
                mPostkey=context.params.mPostkey;
                mReplyKey = context.params.replyKey;

                mreplyUID= snap.data().replyTarget;
                mreplyBody=snap.data().replyBody
                mRereplyUID=snap.data().replyUID


        //         await db.collection("buildings").doc(mBuildingkey).collection("posts").doc(mPostkey).get()
        // .then(async(doc) => {
        //     if(doc.exists){
        //         // console.log(doc.id);
        //
        //         mpostTitle.push(doc.data().postTitle);
        //         mpostUID.push(doc.data().postUID);
        //         console.log("postUID is",doc.data().postUID);
        //         // console.log(doc.data().created);
        //
        //     }
        //
        //
        //
        //
        //     });
        //대댓쓴이=댓쓴이이면 끝냄
        if(mreplyUID==mRereplyUID){
            return;
        }
        if(mreplyUID==null){ // 대댓글이 아닌 경우에는 끝냄
            return;
        }


        //console.log("postUID is",a);
        const payload = {
            notification: {
              title: '대댓글알림',
             body: `내가 쓴 댓글에 대댓글이 달렸습니다!`,
              click_action: "FCM_MY_REPLY_ACTIVITY"


            },
            data : {
                "mBuildingkey" : mBuildingkey,
                "mPostkey" : mPostkey,
                "click_action" : "FCM_MY_REPLY_ACTIVITY",
                "mreplyUID" : mreplyUID,
                "mreplyBody" : mreplyBody,
                "mRereplyUID" : mRereplyUID
              }
          };

        var tokens = [];

        // FireStore 에서 데이터 읽어오기
        await db.collection('users').doc(mreplyUID).get().then((doc) => {
            if(doc.exists){

                if(doc.data().notificationSettings==false){
                    return;
                }else{
                    tokens.push(doc.data().FCMtoken);
                }


            }
            });

            console.log(tokens);


            if (tokens.length > 0 ){
                admin.messaging().sendToDevice(tokens, payload)
                .then(function(response) {
                    // See the MessagingDevicesResponse reference documentation for
                    // the contents of response.
                    console.log('Successfully sent message:', response);
                })
                .catch(function(error) {
                    console.log('Error sending message:', error);
                });

            }

            })
/////////////////////////////////////////////////////////////////////////////////////////////////
        exports.sendHotNotification = functions.region('asia-northeast3').firestore
        .document('/hots/{mHotPostKey}')
            .onCreate(async(snap, context) => {
                // Get an object representing the document
                // e.g. {'name': 'Marie', 'age': 66}


                mBuildingkey = snap.data().hotBID;
                mPostkey=snap.data().hotPID;
                mpostUID=[];
                mhotTitle=snap.data().hotTitle;


                // functions.firestore.document('/buildings/${mBuildingkey}/posts/${mPostkey}')
                await db.collection("buildings").doc(mBuildingkey).collection("posts").doc(mPostkey).get()
                .then(async(doc) => {
                    if(doc.exists){
                        // console.log(doc.id);


                        mpostUID.push(doc.data().postUID);
                        console.log("postUID is",doc.data().postUID);
                        // console.log(doc.data().created);

                    }




                    });



                //console.log("postUID is",a);
                const payload = {
                    notification: {
                      title: '인기글 알림',
                      body: `${mhotTitle}글이 인기글이 되었습니다!`,
                      click_action: "FCM_FEED_DETAIL_ACTIVITY"


                    },
                    data : {
                        "mBuildingkey" : mBuildingkey,
                        "mPostkey" : mPostkey,
                        "click_action" : "FCM_FEED_DETAIL_ACTIVITY",
                        "mpostTitle" : mhotTitle,
                        "mreplyBody" : ""
                      }
                  };

                var tokens = [];

                // FireStore 에서 데이터 읽어오기
                await db.collection('users').doc(mpostUID[0]).get().then((doc) => {
                    if(doc.exists){

                        if(doc.data().notificationHotSettings==false){
                            return;
                        }else{
                            tokens.push(doc.data().FCMtoken);
                        }


                    }
                    });

                    console.log(tokens);


                    if (tokens.length > 0 ){
                        admin.messaging().sendToDevice(tokens, payload)
                        .then(function(response) {
                            // See the MessagingDevicesResponse reference documentation for
                            // the contents of response.
                            console.log('Successfully sent message:', response);
                        })
                        .catch(function(error) {
                            console.log('Error sending message:', error);
                        });

                    }

                })
        // .catch((err) => {
        //     console.log('Error getting documents', err);
        //     return false;
        // });


        //a=db.doc('/buildings/${mBuildingkey}/posts/${mPostkey}').onSnapshot;
        //const results = await Promise.all([a]);
        //console.log(a);
        //return results;

        //const getDeviceTokensPromise = db.doc(`/users/${followedUid}/notificationTokens`).once('value');







    //   // Get the list of device notification tokens.


    //   // Get the follower profile.
    //   const getFollowerProfilePromise = admin.auth().getUser(followerUid);

    //   // The snapshot to the user's tokens.
    //   let tokensSnapshot;

    //   // The array containing all the user's tokens.
    //   let tokens;

    //   const results = await Promise.all([getDeviceTokensPromise, getFollowerProfilePromise]);
    //   tokensSnapshot = results[0];
    //   const follower = results[1];

    //   // Check if there are any device tokens.
    //   if (!tokensSnapshot.hasChildren()) {
    //     return functions.logger.log(
    //       'There are no notification tokens to send to.'
    //     );
    //   }
    //   functions.logger.log(
    //     'There are',
    //     tokensSnapshot.numChildren(),
    //     'tokens to send notifications to.'
    //   );
    //   functions.logger.log('Fetched follower profile', follower);

    //   // Notification details.
    //   const payload = {
    //     notification: {
    //       title: 'You have a new follower!',
    //       body: `${follower.displayName} is now following you.`,
    //       icon: follower.photoURL
    //     }
    //   };

    //   // Listing all tokens as an array.
    //   tokens = Object.keys(tokensSnapshot.val());
    //   // Send notifications to all tokens.
    //   const response = await admin.messaging().sendToDevice(tokens, payload);
    //   // For each message check if there was an error.
    //   const tokensToRemove = [];
    //   response.results.forEach((result, index) => {
    //     const error = result.error;
    //     if (error) {
    //       functions.logger.error(
    //         'Failure sending notification to',
    //         tokens[index],
    //         error
    //       );
    //       // Cleanup the tokens who are not registered anymore.
    //       if (error.code === 'messaging/invalid-registration-token' ||
    //           error.code === 'messaging/registration-token-not-registered') {
    //         tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
    //       }
    //     }
    //   });
    //   return Promise.all(tokensToRemove);
    // });

