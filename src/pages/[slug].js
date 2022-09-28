import dateformat from "dateformat";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import styles from "../styles/Detail.module.css";

export async function getStaticPaths() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/campaigns`);

  const data = await response.json();

  const allSlugs = data.map((item) => item.slug);

  const paths = allSlugs.map((slug) => ({
    params: {
      slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/campaigns/${params.slug}`
  );

  const data = await response.json();

  return {
    props: {
      data,
    },
  };
}

export default function Campaign({ data }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        email,
        campaign: data.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    setIsSubmitting(true);
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/campaigns/subscribe`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        setIsSubmitted(true);
      })
      .catch((error) => console.log("error", error))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
      </Head>

      <div className={styles.wrapper}>
        <div className={styles.main}></div>

        <div className={styles.contents}>
          <Image
            className={styles.img}
            src={"https://res.cloudinary.com/docyioz1a/" + data.logo}
            height={120}
            width={120}
            alt="Campaign Banner"
          />

          <div className={styles.grid}>
            <div className={styles.left}>
              <h1 className={styles.title}>{data.title}</h1>
              <p className={styles.description}>{data.description}</p>
            </div>
            <div className={styles.right}>
              {!isSubmitted ? (
                <div className={styles.rightContents}>
                  <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                      <input
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        type="email"
                        name="email"
                        placeholder="Enter an Email"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.submit}>
                      <input
                        type="submit"
                        value={isSubmitting ? "PLEASE WAIT" : "SUBSCRIBE"}
                        disabled={isSubmitting}
                        className={styles.button}
                      />

                      <p className={styles.concent}>
                        We respect your privacy, Unsubscribe anytime
                      </p>
                    </div>
                  </form>
                </div>
              ) : (
                <div className={styles.thankyou}>
                  <div className={styles.icon}>
                    <FaCheckCircle size={17} color="green" />
                  </div>
                  <div className={styles.message}>
                    Thank you for subscribing!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.item}>
        <div className={styles.imgContainer}></div>
        <div className={styles.rightItems}>
          <small>
            {dateformat(
              new Date(data.created_at),
              "dddd, mmmm, dS, yyyy, h:MM:ss TT"
            )}
          </small>
        </div>

        <footer className={styles.footer}>
          <Link href="/">
            <a>Go back to list</a>
          </Link>
        </footer>
      </div>
    </div>
  );
}
