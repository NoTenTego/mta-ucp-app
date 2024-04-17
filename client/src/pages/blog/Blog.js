import React, { useEffect, useState } from "react"
import Typography from "@mui/material/Typography"
import { Divider, Stack, useMediaQuery, Box, Modal } from "@mui/material"
import { motion } from "framer-motion"
import Updates from "./Updates"
import News from "./News"
import Login from "../account/Login"
import Register from "../account/Register"
import PassRecall from "../account/PassRecall"

const words = ["strażakiem", "lekarzem", "policjantem", "gangsterem", "mechanikiem", "adwokatem", "dziennikarzem", "biznesmenem"]

function Blog({ theme, loginState, setLoginState, open, setOpen }) {
  const isSmallScreen = useMediaQuery("(max-width:770px)")

  const [wordIndex, setWordIndex] = useState(0)
  const [currentWord, setCurrentWord] = useState("")
  const [isAddingLetters, setIsAddingLetters] = useState(true)
  const [letterIndex, setLetterIndex] = useState(1)

  const waitAfterFullWord = 7

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      if (isAddingLetters) {
        if (letterIndex === words[wordIndex].length + waitAfterFullWord) {
          setIsAddingLetters(false)
        } else {
          setLetterIndex((prevIndex) => prevIndex + 1)
        }
      } else {
        setLetterIndex((prevIndex) => prevIndex - 1)
      }
    }, 120)

    return () => {
      clearTimeout(animationTimeout)
    }
  }, [letterIndex, isAddingLetters, wordIndex])

  useEffect(() => {
    if (isAddingLetters && letterIndex === 1) {
      setCurrentWord(words[wordIndex][0])
    } else {
      setCurrentWord(words[wordIndex].substring(0, letterIndex))
    }

    if (!isAddingLetters && letterIndex === 1) {
      setIsAddingLetters(true)
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length)
    }
  }, [letterIndex, wordIndex, isAddingLetters])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: isSmallScreen ? "90%" : null }}>
          {loginState === 1 ? <Login theme={theme} setLoginState={setLoginState} setOpen={setOpen} /> : loginState === 2 ? <Register theme={theme} setLoginState={setLoginState} /> : <PassRecall theme={theme} setLoginState={setLoginState} />}
        </Box>
      </Modal>
      <Stack
        spacing={5}
        mb={2}
        onClick={() => {
          setOpen(false)
        }}>
        <div
          style={{
            maxHeight: "350px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <video autoPlay loop muted style={{ width: "100%", height: "auto", filter: "blur(5px)" }}>
              <source src={require("../../assets/blogVideo.mp4")} type='video/mp4' />
            </video>
            <div
              style={{
                position: "absolute",
                width: "100%",
                background: "rgba(0, 0, 0, 0.3)",
                padding: "1rem",
                backdropFilter: "blur(10px)",
              }}>
              <Typography variant={isSmallScreen ? "h6" : "h5"} textAlign={"center"} style={{ color: "#cccccc" }}>
                Zostań kim chcesz!
              </Typography>
              <Typography variant={isSmallScreen ? "h4" : "h3"} textAlign={"center"} fontWeight={600} color={"primary.main"}>
                {currentWord.toUpperCase()}
                <span style={{ color: "#cccccc", fontWeight: 400 }}>|</span>
              </Typography>
            </div>
          </div>
        </div>
        <Divider>Wiadomości & Ogłoszenia</Divider>
        <News />
        <Divider>Nowości & Zmiany</Divider>
        <Updates />
      </Stack>
    </motion.div>
  )
}

export default Blog
