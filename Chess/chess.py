import sys
import pygame
import pymsgbox
import random


# Window Size
SIZE = (1080, 640)

# Pygame Initialization
pygame.init()
screen = pygame.display.set_mode(SIZE)
pygame.display.set_caption('Chess')
font = pygame.font.SysFont('consolas', 30)

# Import Images
Bb = pygame.image.load('Bb.png')
Bw = pygame.image.load('Bw.png')
Kb = pygame.image.load('Kb.png')
Kw = pygame.image.load('Kw.png')
Nb = pygame.image.load('Nb.png')
Nw = pygame.image.load('Nw.png')
Pb = pygame.image.load('Pb.png')
Pw = pygame.image.load('Pw.png')
Qb = pygame.image.load('Qb.png')
Qw = pygame.image.load('Qw.png')
Rb = pygame.image.load('Rb.png')
Rw = pygame.image.load('Rw.png')

# Colors
WHITE = (234, 234, 210)
BLUE = (75, 114, 153)
BEIGE = (255, 237, 204)
BROWN = (84, 41, 26)
DBROWN = (48, 20, 10)
GREEN = (142, 170, 48)
RED = (255, 137, 137)

# Piece Values
EMPTY = 0
PAWN = 1
ROOK = 2
KNIGHT = 3
BISHOP = 4
QUEEN = 5
KING = 6

# Board Var
board = [[0 for x in range(8)] for y in range(8)]

# Game Vars
selected = (-1, -1)
possible = []
turn = 1
check = False

wins = 0
losses = 0
leader_board = []

AI = True


def reset_board():
    global board, selected, possible, turn, check

    board = [[0 for x in range(8)] for y in range(8)]

    # Set Pieces
    for x in range(8):
        board[1][x] = -PAWN
        board[6][x] = PAWN
    board[0][0] = board[0][7] = -ROOK
    board[7][0] = board[7][7] = ROOK
    board[0][1] = board[0][6] = -KNIGHT
    board[7][1] = board[7][6] = KNIGHT
    board[0][2] = board[0][5] = -BISHOP
    board[7][2] = board[7][5] = BISHOP
    board[0][3] = -QUEEN
    board[7][3] = QUEEN
    board[0][4] = -KING
    board[7][4] = KING

    selected = (-1, -1)
    possible = []
    turn = 1
    check = False


reset_board()


def get_king(color):
    for i in range(8):
        for j in range(8):
            if board[j][i] == KING * color:
                return i, j


def king_threatened(color):
    pos = (-1, -1)
    for i in range(8):
        for j in range(8):
            if board[j][i] == KING * color:
                pos = (i, j)
                break
        if not pos == (-1, -1):
            break

    for i in range(8):
        for j in range(8):
            if board[j][i] * color < 0:
                if pos in get_possible((i, j), False):
                    return True

    return False


def has_moves(color):
    for i in range(8):
        for j in range(8):
            if board[j][i] * color > 0 and len(get_possible((i, j))) > 0:
                return True
    return False


def get_random_move(color):
    moves = []
    for i in range(8):
        for j in range(8):
            if board[j][i] * color > 0:
                piece_moves = get_possible((i, j))
                for move in piece_moves:
                    moves.append([(i, j), move])
    return random.choice(moves)


# noinspection PyShadowingNames
def get_possible(pos, check_illegal=True):
    x = pos[0]
    y = pos[1]
    piece = abs(board[y][x])
    color = piece//board[y][x]
    moves = []
    if piece == EMPTY:
        return moves
    elif piece == PAWN:
        if color > 0:
            if y - 1 >= 0 and board[y - 1][x] == EMPTY:
                moves.append((x, y - 1))
            if y == 6 and board[4][x] == EMPTY:
                moves.append((x, 4))
            # noinspection PyChainedComparisons
            if y - 1 >= 0 and x - 1 >= 0 and board[y - 1][x - 1] < 0:
                moves.append((x - 1, y - 1))
            # noinspection PyChainedComparisons
            if y - 1 >= 0 and x + 1 < 8 and board[y - 1][x + 1] < 0:
                moves.append((x + 1, y - 1))
        if color < 0:
            if y + 1 < 8 and board[y + 1][x] == EMPTY:
                moves.append((x, y + 1))
            if y == 1 and board[3][x] == EMPTY:
                moves.append((x, 3))
            # noinspection PyChainedComparisons
            if y + 1 < 8 and x - 1 >= 0 and board[y + 1][x - 1] > 0:
                moves.append((x - 1, y + 1))
            # noinspection PyChainedComparisons
            if y + 1 < 8 and x + 1 < 8 and board[y + 1][x + 1] > 0:
                moves.append((x + 1, y + 1))
    elif piece == ROOK:
        for i in range(x + 1, 8):
            if board[y][i] == EMPTY:
                moves.append((i, y))
            elif board[y][i] * board[y][x] < 0:
                moves.append((i, y))
                break
            else:
                break
        for i in range(x - 1, -1, -1):
            if board[y][i] == EMPTY:
                moves.append((i, y))
            elif board[y][i] * board[y][x] < 0:
                moves.append((i, y))
                break
            else:
                break
        for i in range(y + 1, 8):
            if board[i][x] == EMPTY:
                moves.append((x, i))
            elif board[i][x] * board[y][x] < 0:
                moves.append((x, i))
                break
            else:
                break
        for i in range(y - 1, -1, -1):
            if board[i][x] == EMPTY:
                moves.append((x, i))
            elif board[i][x] * board[y][x] < 0:
                moves.append((x, i))
                break
            else:
                break
    elif piece == KNIGHT:
        if y - 2 >= 0:
            if x - 1 >= 0 and board[y - 2][x - 1] * board[y][x] <= 0:
                moves.append((x - 1, y - 2))
            if x + 1 < 8 and board[y - 2][x + 1] * board[y][x] <= 0:
                moves.append((x + 1, y - 2))
        if y + 2 < 8:
            if x - 1 >= 0 and board[y + 2][x - 1] * board[y][x] <= 0:
                moves.append((x - 1, y + 2))
            if x + 1 < 8 and board[y + 2][x + 1] * board[y][x] <= 0:
                moves.append((x + 1, y + 2))
        if x - 2 >= 0:
            if y - 1 >= 0 and board[y - 1][x - 2] * board[y][x] <= 0:
                moves.append((x - 2, y - 1))
            if y + 1 < 8 and board[y + 1][x - 2] * board[y][x] <= 0:
                moves.append((x - 2, y + 1))
        if x + 2 < 8:
            if y - 1 >= 0 and board[y - 1][x + 2] * board[y][x] <= 0:
                moves.append((x + 2, y - 1))
            if y + 1 < 8 and board[y + 1][x + 2] * board[y][x] <= 0:
                moves.append((x + 2, y + 1))
    elif piece == BISHOP:
        for i in range(1, min(8 - x, 8 - y)):
            if board[y + i][x + i] == EMPTY:
                moves.append((x + i, y + i))
            elif board[y + i][x + i] * board[y][x] < 0:
                moves.append((x + i, y + i))
                break
            else:
                break
        for i in range(1, min(x + 1, 8 - y)):
            if board[y + i][x - i] == EMPTY:
                moves.append((x - i, y + i))
            elif board[y + i][x - i] * board[y][x] < 0:
                moves.append((x - i, y + i))
                break
            else:
                break
        for i in range(1, min(x + 1, y + 1)):
            if board[y - i][x - i] == EMPTY:
                moves.append((x - i, y - i))
            elif board[y - i][x - i] * board[y][x] < 0:
                moves.append((x - i, y - i))
                break
            else:
                break
        for i in range(1, min(8 - x, y + 1)):
            if board[y - i][x + i] == EMPTY:
                moves.append((x + i, y - i))
            elif board[y - i][x + i] * board[y][x] < 0:
                moves.append((x + i, y - i))
                break
            else:
                break
    elif piece == QUEEN:
        for i in range(x + 1, 8):
            if board[y][i] == EMPTY:
                moves.append((i, y))
            elif board[y][i] * board[y][x] < 0:
                moves.append((i, y))
                break
            else:
                break
        for i in range(x - 1, -1, -1):
            if board[y][i] == EMPTY:
                moves.append((i, y))
            elif board[y][i] * board[y][x] < 0:
                moves.append((i, y))
                break
            else:
                break
        for i in range(y + 1, 8):
            if board[i][x] == EMPTY:
                moves.append((x, i))
            elif board[i][x] * board[y][x] < 0:
                moves.append((x, i))
                break
            else:
                break
        for i in range(y - 1, -1, -1):
            if board[i][x] == EMPTY:
                moves.append((x, i))
            elif board[i][x] * board[y][x] < 0:
                moves.append((x, i))
                break
            else:
                break
        for i in range(1, min(8 - x, 8 - y)):
            if board[y + i][x + i] == EMPTY:
                moves.append((x + i, y + i))
            elif board[y + i][x + i] * board[y][x] < 0:
                moves.append((x + i, y + i))
                break
            else:
                break
        for i in range(1, min(x + 1, 8 - y)):
            if board[y + i][x - i] == EMPTY:
                moves.append((x - i, y + i))
            elif board[y + i][x - i] * board[y][x] < 0:
                moves.append((x - i, y + i))
                break
            else:
                break
        for i in range(1, min(x + 1, y + 1)):
            if board[y - i][x - i] == EMPTY:
                moves.append((x - i, y - i))
            elif board[y - i][x - i] * board[y][x] < 0:
                moves.append((x - i, y - i))
                break
            else:
                break
        for i in range(1, min(8 - x, y + 1)):
            if board[y - i][x + i] == EMPTY:
                moves.append((x + i, y - i))
            elif board[y - i][x + i] * board[y][x] < 0:
                moves.append((x + i, y - i))
                break
            else:
                break
    elif piece == KING:
        if y - 1 >= 0:
            if x - 1 >= 0 and board[y - 1][x - 1] * board[y][x] <= 0:
                moves.append((x - 1, y - 1))
            if board[y - 1][x] * board[y][x] <= 0:
                moves.append((x, y - 1))
            if x + 1 < 8 and board[y - 1][x + 1] * board[y][x] <= 0:
                moves.append((x + 1, y - 1))
        if x - 1 >= 0:
            if board[y][x - 1] * board[y][x] <= 0:
                moves.append((x - 1, y))
        if x + 1 < 8:
            if board[y][x + 1] * board[y][x] <= 0:
                moves.append((x + 1, y))
        if y + 1 < 8:
            if x - 1 >= 0 and board[y + 1][x - 1] * board[y][x] <= 0:
                moves.append((x - 1, y + 1))
            if board[y + 1][x] * board[y][x] <= 0:
                moves.append((x, y + 1))
            if x + 1 < 8 and board[y + 1][x + 1] * board[y][x] <= 0:
                moves.append((x + 1, y + 1))
    if check_illegal:
        remove = []
        for move in moves:
            if not secondary_check(pos, move, color):
                remove.append(move)
        for move in remove:
            moves.remove(move)
    return moves


def secondary_check(pi, pf, color):
    temp = board[pf[1]][pf[0]]
    board[pf[1]][pf[0]] = board[pi[1]][pi[0]]
    board[pi[1]][pi[0]] = EMPTY
    res = True
    if king_threatened(color):
        res = False
    board[pi[1]][pi[0]] = board[pf[1]][pf[0]]
    board[pf[1]][pf[0]] = temp
    return res


def update_graphics():
    screen.fill(BEIGE)
    pygame.draw.rect(screen, BROWN, pygame.Rect(60, 60, 520, 520))
    pygame.draw.rect(screen, DBROWN, pygame.Rect(76, 76, 488, 488))

    # Draw Graphics
    for i in range(8):
        for j in range(8):
            pygame.draw.rect(screen, WHITE if (i + j) % 2 == 0 else BLUE, pygame.Rect(80 + 60 * i, 80 + 60 * j, 60, 60))
            if abs(board[j][i]) == PAWN:
                screen.blit(Pw if board[j][i] > 0 else Pb, (80 + 60 * i, 80 + 60 * j))
            elif abs(board[j][i]) == ROOK:
                screen.blit(Rw if board[j][i] > 0 else Rb, (80 + 60 * i, 80 + 60 * j))
            elif abs(board[j][i]) == KNIGHT:
                screen.blit(Nw if board[j][i] > 0 else Nb, (80 + 60 * i, 80 + 60 * j))
            elif abs(board[j][i]) == BISHOP:
                screen.blit(Bw if board[j][i] > 0 else Bb, (80 + 60 * i, 80 + 60 * j))
            elif abs(board[j][i]) == QUEEN:
                screen.blit(Qw if board[j][i] > 0 else Qb, (80 + 60 * i, 80 + 60 * j))
            elif abs(board[j][i]) == KING:
                if check and board[j][i] * turn > 0:
                    pygame.draw.rect(screen, RED, pygame.Rect(80 + 60 * i, 80 + 60 * j, 60, 60))
                screen.blit(Kw if board[j][i] > 0 else Kb, (80 + 60 * i, 80 + 60 * j))

    for pos in possible:
        left = 80 + 60 * pos[0]
        top = 80 + 60 * pos[1]
        right = left + 60
        bottom = top + 60
        if board[pos[1]][pos[0]] != 0:
            pygame.draw.polygon(screen, GREEN, [(left, top), (left + 12, top), (left, top + 12)])
            pygame.draw.polygon(screen, GREEN, [(right, top), (right - 12, top), (right, top + 12)])
            pygame.draw.polygon(screen, GREEN, [(left, bottom), (left + 12, bottom), (left, bottom - 12)])
            pygame.draw.polygon(screen, GREEN, [(right, bottom), (right - 12, bottom), (right, bottom - 12)])
        else:
            pygame.draw.circle(screen, GREEN, (left + 30, top + 30), 8)

    won_text = font.render("Wins: {}".format(wins), True, (0, 0, 0))
    loss_text = font.render("Losses: {}".format(losses), True, (0, 0, 0))

    screen.blit(won_text, (70, 585))
    screen.blit(loss_text, (570 - loss_text.get_width(), 585))

    leader_board_title = font.render('{:10}{:10}'.format('Name', 'W/(L+1)'), True, (0, 0, 0))
    screen.blit(leader_board_title, (700, 80))

    for i in range(len(leader_board)):
        entry_text = font.render('{:10}{}'.format(leader_board[i][0], leader_board[i][1]), True, (0, 0, 0))
        screen.blit(entry_text, (700, 140+60*i))

    pygame.display.flip()


def game_over():
    global wins, losses

    msg = pymsgbox.prompt('{} won. Type P to play again or S to submit score'.format(('BLACK', 'WHITE')[turn < 0]),
                          'Game Over')
    while msg not in ['P', 'S']:
        msg = pymsgbox.prompt('Invalid Option. Type P to play again or S to submit score', 'Error')
    if turn < 0:
        wins += 1
    else:
        losses += 1
    if msg == 'S':
        name = pymsgbox.prompt('Enter your name', 'Name')
        leader_board.append([name, wins / (losses + 1)])
        leader_board.sort(key=lambda x: x[1])
        wins = losses = 0
    reset_board()
    update_graphics()


def stalemate():
    global wins, losses

    msg = pymsgbox.prompt('Stalemate. Type P to play again or S to submit score'.format(('BLACK', 'WHITE')[turn < 0]),
                          'Game Over')
    while msg not in ['P', 'S']:
        msg = pymsgbox.prompt('Invalid Option. Type P to play again or S to submit score', 'Error')
    if msg == 'S':
        name = pymsgbox.prompt('Enter your name', 'Name')
        leader_board.append([name, wins / (losses + 1)])
        leader_board.sort(key=lambda x: x[1])
        wins = losses = 0
    reset_board()
    update_graphics()


update_graphics()
while 1:
    for event in pygame.event.get():
        if event.type == pygame.MOUSEBUTTONDOWN:
            x, y = pygame.mouse.get_pos()
            X = (x - 80)//60
            Y = (y - 80)//60
            if 0 <= X < 8 and 0 <= Y < 8:
                if (X, Y) in possible:
                    board[Y][X] = board[selected[1]][selected[0]]
                    board[selected[1]][selected[0]] = EMPTY
                    selected = (-1, -1)
                    possible = []
                    turn *= -1
                    check = False
                    update_graphics()
                    if king_threatened(turn):
                        check = True
                        update_graphics()
                        if not has_moves(turn):
                            game_over()
                            continue
                    if not has_moves(turn):
                        stalemate()
                        continue
                    if AI:
                        initial, final = get_random_move(turn)
                        board[final[1]][final[0]] = board[initial[1]][initial[0]]
                        board[initial[1]][initial[0]] = EMPTY
                        turn *= -1
                        check = False
                        update_graphics()
                        if king_threatened(turn):
                            check = True
                            update_graphics()
                            if not has_moves(turn):
                                game_over()
                                continue
                        if not has_moves(turn):
                            stalemate()
                            continue

                elif board[Y][X] == EMPTY or board[Y][X] * turn < 0:
                    selected = (-1, -1)
                    possible = []
                    update_graphics()
                else:
                    selected = (X, Y)
                    possible = get_possible(selected)
                    update_graphics()
        if event.type == pygame.QUIT:
            sys.exit()
