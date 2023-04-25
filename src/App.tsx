import { useEffect, useState } from "react";
import * as C from "./App.Styles";
import logoImage from "./assets/devmemory_logo.png";
import restartIcon from "./svgs/restart.svg";

import { Button } from "./components/Button";
import { InfoItem } from "./components/InfoItem/Index";
import { GridItem } from "./components/GridItem";

import { GridItemType } from "./types/GridItemType";
import { items } from "./data/items";

const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(), []); //Roda a função ao carregar a página.

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

  const handleItemClick = (index: number) => {};

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width={200} alt="" />
        </C.LogoLink>
        <C.InfoArea>InfoArea</C.InfoArea>
        <InfoItem label="Tempo" value="00:00" />
        <InfoItem label="Movimentos" value="0" />
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
