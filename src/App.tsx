import { useEffect, useState } from "react";
import * as C from "./App.Styles";
import logoImage from "./assets/devmemory_logo.png";
import restartIcon from "./svgs/restart.svg";

import { Button } from "./components/Button";
import { InfoItem } from "./components/InfoItem/Index";
import { GridItem } from "./components/GridItem";

import { GridItemType } from "./types/GridItemType";
import { items } from "./data/items";
import { formatTimeElapsed } from "./helpers/formatTimeelapsed";

const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(), []); //Roda a função ao carregar a página.

  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer); // Return dentro de useEffect é executado quando o programa é finalizado ou atualizado.
  }, [playing, timeElapsed]); // Aqui no array final, temos o play e o timeElapsed que são as variáveis sendo observadas pelo useEffect

  // verifica se os abertos são iguais
  useEffect(() => {
    if (shownCount === 2) {
      let opened = gridItems.filter((item) => item.shown === true); // cria um array somente com os items que estão abertos.
      if (opened.length === 2) {
        // verifica se  eles são iguais, torná-los permanentes
        if (opened[0].item === opened[1].item) {
          let tmpGrid = [...gridItems];
          for (let i in tmpGrid) {
            if (tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShownCount(0);
          }
        } else {
          // não são iguais, shown é false
          setTimeout(() => {
            let tmpGrid = [...gridItems];
            for (let i in tmpGrid) {
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShownCount(0);
          }, 1000); // aguarda um segundo mostrando eles errados depois faz a correção.
        }

        setMoveCount((moveCount) => moveCount + 1);
      }
    }
  }, [shownCount, gridItems]);

  // verifica se deu game over
  useEffect(() => {
    if (
      moveCount > 0 &&
      gridItems.every((item) => item.permanentShown === true)
    ) {
      // every verifica se todos os items são true.
      setPlaying(false);
    }
  }, [moveCount, gridItems]); // se um desses items modificar ele roda a funçao do useEffect

  const resetAndCreateGrid = () => {
    //Passo 1 - Resetar o jogo
    //setPlaying(false);
    //setGridItems([]);
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);

    //Passo 2 - criar o grid e começar o  jogo

    //2.1 - Criar um grid vazio
    let tmpGrid: GridItemType[] = [];
    for (let i = 0; i < items.length * 2; i++)
      tmpGrid.push({ item: null, shown: false, permanentShown: false });

    //2.2 Preencher o grid
    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i++) {
        let pos = -1;
        while (pos < 0 || tmpGrid[pos].item != null) {
          pos = Math.floor(Math.random() * items.length * 2); //Gera um aleatório entre 1 e o número maximo de casas
        }
        tmpGrid[pos].item = i;
      }
    }
    setGridItems(tmpGrid);
    //2.3 jogar no state
    //3 - começar o jogo
    setPlaying(true);
  };

  const handleItemClick = (index: number) => {
    if (playing && index !== null && shownCount < 2) {
      // jogo tá rolando? a partir de showcount 2 não pode exibir o terceiro item
      let tmpGrid = [...gridItems]; // cria o clone do array de objeto depois muda lá no setgriditems

      if (
        tmpGrid[index].permanentShown === false &&
        tmpGrid[index].shown === false
      ) {
        // o item está de costas
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1);
      }

      setGridItems(tmpGrid);
    }
  };

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width={200} alt="" />
        </C.LogoLink>
        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label="Movimentos" value={moveCount.toString()} />
        </C.InfoArea>
        <Button
          label="Reiniciar"
          icon={restartIcon}
          onClick={resetAndCreateGrid}
        />
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem
              key={index}
              item={item}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
};

export default App;
