/*
 * Copyright (c) 2021 Snowplow Analytics Ltd, 2010 Anthon Pang
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { BrowserPlugin, BrowserTracker, dispatchToTrackersInCollection } from '@snowplow/browser-tracker-core';
import {
  buildSelfDescribingEvent,
  CommonEventProperties,
  Logger,
  Payload,
  PayloadBuilder,
  SelfDescribingJson,
} from '@snowplow/tracker-core';

export type MyContext = {
  property: string;
};

const _trackers: Record<string, BrowserTracker> = {};
const _context: Record<string, MyContext> = {};
let LOG: Logger;

/**
 * A Complete Template Plugin
 *
 * An example of what a Snowplow Browser Plugin could look like
 */
export function TemplatePlugin(): BrowserPlugin {
  let trackerId: string;

  return {
    activateBrowserPlugin: (tracker) => {
      trackerId = tracker.id; // Store which trackerId this plugin has been initialised for
      _trackers[tracker.id] = tracker; // Used for per-tracker logic on APIs
    },
    contexts: () => {
      if (_context[trackerId]) {
        return [
          {
            schema: 'iglu:com.acme/my_context/jsonschema/1-0-0',
            data: _context[trackerId],
          },
        ];
      }

      return [];
    },
    beforeTrack: (payloadBuilder: PayloadBuilder) => {
      // Use to modify the payload before sending to the collector
      LOG.info('All your JSON', payloadBuilder.getJson());
      LOG.info('Payload so far', payloadBuilder.getPayload());
      LOG.info('Built final payload', payloadBuilder.build()); // Includes in Base64 Encoded JSON in payload
    },
    afterTrack: (payload: Payload) => {
      // Create behaviour based on a tracked payload
      LOG.info('Just tracked', payload['e']);
    },
    logger: (logger) => {
      LOG = logger;
    },
  };
}

/**
 * Here is an API function which enabled a context for specific trackers
 * @param context - the data for the context
 * @param trackers - The tracker identifiers which should have the context enabled
 */
export function enableMyContext(context: MyContext, trackers: Array<string> = Object.keys(_trackers)): void {
  for (const id of trackers) {
    if (_trackers[id]) {
      _context[id] = context;
    }
  }
}

export type MyEventData = { eventProp: string };
export type MyEvent = SelfDescribingJson<MyEventData>

/**
 * Track a custom event
 *
 * @param event - The event information
 * @param trackers - The tracker identifiers which the event will be sent to
 */
export function trackMyEvent(
  event: MyEvent & CommonEventProperties,
  trackers: Array<string> = Object.keys(_trackers)
): void {
  dispatchToTrackersInCollection(trackers, _trackers, (t) => {
    t.core.track(
      buildSelfDescribingEvent({ event }),
      event.context,
      event.timestamp
    );
  });
}
