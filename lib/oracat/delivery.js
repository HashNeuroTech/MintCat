import { followAcceptActivity, createActivity, followActivity } from "./activitypub";
import { signRequest } from "./http-signatures";

export async function deliverActivity({ activity, inboxUrl, privateKeyPem }) {
  const body = JSON.stringify(activity);
  const headers = signRequest({
    privateKeyPem,
    url: inboxUrl,
    body
  });

  const response = await fetch(inboxUrl, {
    method: "POST",
    headers,
    body,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Inbox delivery failed: ${response.status}`);
  }
}

export async function deliverCreateToFollowers({ account, post, baseUrl, targets }) {
  if (!targets.length) {
    return;
  }

  const activity = createActivity(baseUrl, account, post);

  await Promise.allSettled(
    targets.map((target) =>
      deliverActivity({
        activity,
        inboxUrl: target.inbox_url,
        privateKeyPem: account.private_key_pem
      })
    )
  );
}

export async function deliverFollowAccept({ localAccount, remoteActor, followActivity, baseUrl }) {
  if (!remoteActor.inbox_url || !localAccount.private_key_pem) {
    return;
  }

  await deliverActivity({
    activity: followAcceptActivity(baseUrl, localAccount, remoteActor, followActivity),
    inboxUrl: remoteActor.inbox_url,
    privateKeyPem: localAccount.private_key_pem
  });
}

export async function deliverFollow({ localAccount, remoteActor, baseUrl }) {
  if (!remoteActor.inbox_url || !localAccount.private_key_pem) {
    throw new Error("Remote actor inbox or local key is missing.");
  }

  await deliverActivity({
    activity: followActivity(baseUrl, localAccount, remoteActor),
    inboxUrl: remoteActor.shared_inbox_url || remoteActor.inbox_url,
    privateKeyPem: localAccount.private_key_pem
  });
}
