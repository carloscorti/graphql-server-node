import * as React from "react";
import "./style-sessions.css";
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";

/* ---> Define queries, mutations and fragments here */
const SPEAKER_ATRIBUTES = gql`
  fragment SpeakerInfo on Speaker {
    id
    name
    bio
    sessions {
      id
      title
    }
    featured
  }
`;

const FEATURED_SPEAKER = gql`
  mutation markFeatured($speakerId: ID!, $featured: Boolean!) {
    markFeatured(speakerId: $speakerId, featured: $featured) {
      id
      featured
    }
  }
`;

const SPEAKERS = gql`
  query speakers {
    speakers {
      ...SpeakerInfo
    }
  }
  ${SPEAKER_ATRIBUTES}
`;

const SPEAKER_BY_ID = gql`
  query speakerById($id: ID!) {
    speakerById(id: $id) {
      ...SpeakerInfo
    }
  }
  ${SPEAKER_ATRIBUTES}
`;

const SpeakerList = () => {
  const [markFeatured] = useMutation(FEATURED_SPEAKER);
  const { loading, error, data } = useQuery(SPEAKERS);

  if (loading) return <p>Loading Speakers...</p>;

  if (error) return <p>Error Loading Speakers...</p>;

  const featured = false;

  return data.speakers.map(({ id, name, bio, sessions, featured }) => (
    <div
      key={id}
      className="col-xs-12 col-sm-6 col-md-6"
      style={{ padding: 5 }}
    >
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{`Speaker: ${name}`}</h3>
        </div>
        <div className="panel-body">
          <h5>{`Bio: ${bio}`}</h5>
        </div>
        <div className="panel-footer">
          <h4>Sessions</h4>
          {sessions.map((session) => (
            <span key={session.id} style={{ padding: 2 }}>
              <p>{session.title}</p>
            </span>
          ))}
          <span>
            <button
              type="button"
              className="btn btn-default btn-lg"
              onClick={async () => {
                await markFeatured({
                  variables: { speakerId: id, featured: true },
                });
              }}
            >
              <i
                className={`fa ${featured ? "fa-star" : "fa-star-o"}`}
                aria-hidden="true"
                style={{
                  color: featured ? "gold" : undefined,
                }}
              ></i>{" "}
              Featured Speaker
            </button>
          </span>
        </div>
      </div>
    </div>
  ));
};

const SpeakerDetails = () => {
  const { speaker_id } = useParams();
  const { loading, error, data } = useQuery(SPEAKER_BY_ID, {
    variables: { id: speaker_id },
  });

  if (loading) return <p>Loading Speakers...</p>;

  if (error) return <p>Error Loading Speakers By Id...</p>;

  const { id, name, bio, sessions } = data.speakerById;

  return (
    <div key={id} className="col-xs-12" style={{ padding: 5 }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{name}</h3>
        </div>
        <div className="panel-body">
          <h5>{bio}</h5>
        </div>
        <div className="panel-footer">
          {sessions.map((session) => (
            <span key={session.id} style={{ padding: 2 }}>
              <p>{session.title}</p>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export function Speaker() {
  return (
    <>
      <div className="container">
        <div className="row">
          <SpeakerDetails />
        </div>
      </div>
    </>
  );
}

export function Speakers() {
  return (
    <>
      <div className="container">
        <div className="row">
          <SpeakerList />
        </div>
      </div>
    </>
  );
}
